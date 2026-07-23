using AutoMapper;
using E_Commerce.Server.Shared.Caching.Abstraction;
using E_Commerce.Server.Shared.Contracts.Events;
using E_Commerce.Server.Shared.Authorization.Roles;
using E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;
using E_Commerce.Server.Shared.ExternalAuthentication.Contracts;
using E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;
using E_Commerce.Server.Shared.Localization.Localizations;
using E_Commerce.Server.Shared.Storage.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangeEmail;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangePassword;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmail;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmailChange;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.CreateNewTokenByRefreshToken;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.DeleteUser;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ForgotPassword;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ExternalLogin;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Login;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Logout;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.RegisterUser;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResendEmailConfirmation;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResetPassword;
using Security.Application.Jwt;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;
using System.Security.Cryptography;
using System.Text;
using Wolverine;

namespace Security.Persistance.Services.UserAttributeServices;

public sealed class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtProvider _jwtProvider;
    private readonly IMapper _mapper;
    private readonly IMessageBus _bus;
    private readonly IFileStorage _fileStorage;
    private readonly IRedisPrimitiveService _redisPrimitiveService;
    private readonly IJwtBlacklistService _jwtBlacklist;
    private readonly ILocalizationService _lan;
    private readonly IExternalAuthProviderResolver _externalAuthProviderResolver;

    public AuthService(
        UserManager<User> userManager,
        IMapper mapper,
        IJwtProvider jwtProvider,
        IMessageBus bus,
        IFileStorage fileStorage,
        IRedisPrimitiveService redisPrimitiveService,
        IJwtBlacklistService jwtBlacklist,
        ILocalizationService lan,
        IExternalAuthProviderResolver externalAuthProviderResolver)
    {
        _userManager = userManager;
        _mapper = mapper;
        _jwtProvider = jwtProvider;
        _bus = bus;
        _fileStorage = fileStorage;
        _redisPrimitiveService = redisPrimitiveService;
        _jwtBlacklist = jwtBlacklist;
        _lan = lan;
        _externalAuthProviderResolver = externalAuthProviderResolver;
    }

    public async Task RegisterAsync(RegisterUserCommand request)
    {
        User user = _mapper.Map<User>(request);
        user.Email = request.Email;
        user.UserName = request.Email;
        IdentityResult result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.Unknown"));

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var code = Guid.NewGuid().ToString("N");

        await _redisPrimitiveService.SetStringAsync(OpaqueConfirmCodeKey(code), $"{user.Id}|{token}", ConfirmCodeTtl, cancellationToken: default);
        await _redisPrimitiveService.SetStringAsync(OpaqueConfirmUserKey(user.Id), code, ConfirmCodeTtl, cancellationToken: default);

        await _bus.PublishAsync(new EmailConfirmationRequestedIntegrationEvent(
            UserId: user.Id.ToString(),
            Email: user.Email,
            Code: code,
            RequestedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));
    }

    public async Task ConfirmEmailAsync(ConfirmEmailCommand request,CancellationToken cancellationToken)
    {
        var stored = await _redisPrimitiveService.GetStringAsync(
            OpaqueConfirmCodeKey(request.Code),
            cancellationToken);

        if (stored is null)
            throw new ArgumentException(
                _lan.Get("Error.EmailConfirmLinkUsed"));

        var parts = stored.Split('|', 2);
        var userId = parts[0];
        var rawToken = parts[1];

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            throw new ArgumentException(
                _lan.Get("Error.UserNotFound"));

        if (user.EmailConfirmed)
        {
            await _redisPrimitiveService.RemoveAsync(
                OpaqueConfirmCodeKey(request.Code),
                cancellationToken);

            await _redisPrimitiveService.RemoveAsync(
                OpaqueConfirmUserKey(userId),
                cancellationToken);

            return;
        }

        var result = await _userManager.ConfirmEmailAsync(
            user,
            rawToken);

        if (!result.Succeeded)
            throw new ArgumentException(
                _lan.Get("Error.InvalidToken"));

        await _redisPrimitiveService.RemoveAsync(
            OpaqueConfirmCodeKey(request.Code),
            cancellationToken);

        await _redisPrimitiveService.RemoveAsync(
            OpaqueConfirmUserKey(userId),
            cancellationToken);
    }

    public async Task ResendEmailConfirmationAsync(ResendEmailConfirmationCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null) return;
        if (user.EmailConfirmed) return;

        var isBlocked = await _redisPrimitiveService.ExistsAsync(ResendBlockKey(user.Id), cancellationToken);
        if (isBlocked)
            throw new InvalidOperationException(_lan.Get("Error.ResendBlocked"));

        var oldCode = await _redisPrimitiveService.GetStringAsync(OpaqueConfirmUserKey(user.Id), cancellationToken);
        if (oldCode is not null)
            await _redisPrimitiveService.RemoveAsync(OpaqueConfirmCodeKey(oldCode), cancellationToken);

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var code = Guid.NewGuid().ToString("N");

        await _redisPrimitiveService.SetStringAsync(OpaqueConfirmCodeKey(code), $"{user.Id}|{token}", ConfirmCodeTtl, cancellationToken);
        await _redisPrimitiveService.SetStringAsync(OpaqueConfirmUserKey(user.Id), code, ConfirmCodeTtl, cancellationToken);

        await _bus.PublishAsync(new EmailConfirmationRequestedIntegrationEvent(
            UserId: user.Id.ToString(),
            Email: user.Email!,
            Code: code,
            RequestedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));

        var attempts = await _redisPrimitiveService.IncrementAsync(ResendCountKey(user.Id), cancellationToken: cancellationToken);
        if (attempts == 1)
            await _redisPrimitiveService.SetExpirationAsync(ResendCountKey(user.Id), ResendBlockTtl, cancellationToken);

        if (attempts >= 3)
            await _redisPrimitiveService.SetStringAsync(ResendBlockKey(user.Id), "blocked", ResendBlockTtl, cancellationToken);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null) return;

        if (!user.EmailConfirmed) return;

        await EnsureForgotPasswordThrottleAsync(user.Id, cancellationToken);

        var oldCode = await _redisPrimitiveService.GetStringAsync(OpaqueResetUserKey(user.Id), cancellationToken);
        if (oldCode is not null)
            await _redisPrimitiveService.RemoveAsync(OpaqueResetCodeKey(oldCode), cancellationToken);

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var code = Guid.NewGuid().ToString("N");
        var ttl = TimeSpan.FromMinutes(30);

        await _redisPrimitiveService.SetStringAsync(OpaqueResetCodeKey(code), $"{user.Id}|{token}", ttl, cancellationToken);
        await _redisPrimitiveService.SetStringAsync(OpaqueResetUserKey(user.Id), code, ttl, cancellationToken);

        await _bus.PublishAsync(new PasswordResetRequestedIntegrationEvent(
            UserId: user.Id.ToString(),
            Email: user.Email!,
            Code: code,
            RequestedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));
    }

    public async Task ResetPasswordAsync(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var stored = await _redisPrimitiveService.GetStringAsync(OpaqueResetCodeKey(request.Code), cancellationToken);
        if (stored is null)
            throw new ArgumentException(_lan.Get("Error.PasswordResetLinkExpired"));

        var parts = stored.Split('|', 2);
        var userId = parts[0];
        var rawToken = parts[1];

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        await _redisPrimitiveService.RemoveAsync(OpaqueResetCodeKey(request.Code), cancellationToken);
        await _redisPrimitiveService.RemoveAsync(OpaqueResetUserKey(userId), cancellationToken);

        var result = await _userManager.ResetPasswordAsync(user, rawToken, request.NewPassword);
        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.InvalidToken"));
    }

    public async Task DeleteAsync(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user is null)
            throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        var imageUrl = user.ImageUrl;

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.Unknown"));

        if (!string.IsNullOrWhiteSpace(imageUrl))
            await _fileStorage.TryDeleteAsync(imageUrl, cancellationToken);

        await _bus.PublishAsync(new AccountDeletedIntegrationEvent(
            UserId: user.Id.ToString(),
            Email: user.Email,
            DeletedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));
    }

    public async Task<LoginCommandResponse> LoginAsync(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null)
        {
            await RegisterFailedLoginAttemptAsync(request.Email, cancellationToken);
            throw new ArgumentException(_lan.Get("Validation.InvalidCredentials"));
        }

        if (!user.EmailConfirmed)
            throw new ArgumentException(_lan.Get("Error.EmailNotVerifiedLogin"));

        bool isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            await RegisterFailedLoginAttemptAsync(request.Email, cancellationToken);
            throw new ArgumentException(_lan.Get("Validation.InvalidCredentials"));
        }

        await ClearFailedLoginAttemptsAsync(request.Email, cancellationToken);

        return await _jwtProvider.CreateTokenAsync(user);
    }

    public async Task<ExternalLoginCommandResponse> ExternalLoginAsync(
        ExternalLoginCommand request,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        cancellationToken.ThrowIfCancellationRequested();

        IExternalAuthProvider externalProvider;

        try
        {
            externalProvider = _externalAuthProviderResolver.Resolve(
                request.Provider);
        }
        catch (ExternalAuthProviderNotSupportedException exception)
        {
            throw new ArgumentException(
                exception.Message,
                nameof(request.Provider),
                exception);
        }

        ExternalUserInfo externalUser;

        try
        {
            externalUser = await externalProvider.ValidateAsync(
                new ExternalAuthCredential(
                    request.Credential,
                    request.RedirectUri),
                cancellationToken);
        }
        catch (ExternalAuthProviderException exception)
        {
            throw new UnauthorizedAccessException(
                _lan.Get("Validation.InvalidCredentials"),
                exception);
        }
        catch (ExternalAuthConfigurationException exception)
        {
            throw new InvalidOperationException(
                exception.Message,
                exception);
        }

        EnsureExternalUserIsValid(externalUser);

        var provider = externalUser.Provider.Trim();
        var providerUserId = externalUser.ProviderUserId.Trim();
        var email = externalUser.Email.Trim();
        var fullName = ResolveExternalFullName(externalUser);
        var isRegisterFlow = string.Equals(
            request.Flow,
            ExternalLoginFlows.Register,
            StringComparison.OrdinalIgnoreCase);

        User? user = await _userManager.FindByLoginAsync(
            provider,
            providerUserId);

        if (user is not null)
        {
            if (isRegisterFlow)
                return CreateAccountExistsResponse(user, externalUser);

            await UpdateExternalUserProfileAsync(
                user,
                externalUser);

            return await CreateAuthenticatedExternalResponseAsync(user);
        }

        user = await _userManager.FindByEmailAsync(email);

        if (user is not null)
        {
            if (isRegisterFlow)
                return CreateAccountExistsResponse(user, externalUser);

            await EnsureAutomaticExternalLinkingIsAllowedAsync(user);
            await EnsureProviderIsNotAlreadyLinkedAsync(user, provider);
            await AddExternalLoginAsync(user, provider, providerUserId);
            await UpdateExternalUserProfileAsync(user, externalUser);

            return await CreateAuthenticatedExternalResponseAsync(user);
        }

        return new ExternalLoginCommandResponse(
            Status: ExternalLoginStatuses.RegistrationRequired,
            Token: null,
            RefreshToken: null,
            RefreshTokenExpires: null,
            UserId: null,
            FullName: fullName,
            Email: email);
    }

    public async Task LogoutAsync(LogoutCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return;

        User? user = await _userManager.Users
            .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

        if (user is null)
            return;

        if (string.IsNullOrWhiteSpace(user.RefreshToken) && user.RefreshTokenExpires is null)
            return;

        user.RefreshToken = null;
        user.RefreshTokenExpires = null;

        IdentityResult result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new Exception(_lan.Get("Error.Unknown"));

        if (!string.IsNullOrWhiteSpace(request.Jti) && request.TokenExpiry.HasValue)
        {
            var remaining = request.TokenExpiry.Value - DateTime.UtcNow;
            if (remaining > TimeSpan.Zero)
                await _jwtBlacklist.BlacklistAsync(request.Jti, remaining, cancellationToken);
        }
    }

    public async Task<LoginCommandResponse> CreateTokenByRefreshTokenAsync(CreateNewTokenByRefreshTokenCommand request, CancellationToken cancellationToken)
    {
        User user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null) throw new ArgumentException(_lan.Get("Error.UserNotFound"));
        if (user.RefreshToken != HashRefreshToken(request.RefreshToken)) throw new ArgumentException(_lan.Get("Error.RefreshTokenInvalid"));
        if (user.RefreshTokenExpires < DateTime.UtcNow) throw new ArgumentException(_lan.Get("Error.RefreshTokenExpired"));
        LoginCommandResponse response = await _jwtProvider.CreateTokenAsync(user);
        return response;
    }


    public async Task RequestEmailChangeAsync(ChangeEmailCommand request, CancellationToken cancellationToken)
    {
        var isOnCooldown = await _redisPrimitiveService.ExistsAsync(EmailChangeCooldownKey(request.UserId), cancellationToken);
        if (isOnCooldown)
            throw new InvalidOperationException(_lan.Get("Error.EmailChangeCooldown"));

        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user is null) throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        if (string.Equals(user.Email, request.NewEmail, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException(_lan.Get("Error.EmailSameAsCurrent"));

        var existing = await _userManager.FindByEmailAsync(request.NewEmail);
        if (existing is not null)
            throw new ArgumentException(_lan.Get("Error.EmailAlreadyInUse"));

        var oldCode = await _redisPrimitiveService.GetStringAsync(EmailChangePendingUserKey(request.UserId), cancellationToken);
        if (oldCode is not null)
            await _redisPrimitiveService.RemoveAsync(EmailChangePendingCodeKey(oldCode), cancellationToken);

        var token = await _userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);
        var code = Guid.NewGuid().ToString("N");

        await _redisPrimitiveService.SetStringAsync(EmailChangePendingCodeKey(code), $"{user.Id}|{request.NewEmail}|{token}", EmailChangePendingTtl, cancellationToken);
        await _redisPrimitiveService.SetStringAsync(EmailChangePendingUserKey(user.Id), code, EmailChangePendingTtl, cancellationToken);

        await _bus.PublishAsync(new EmailChangeRequestedIntegrationEvent(
            UserId: user.Id.ToString(),
            NewEmail: request.NewEmail,
            Code: code,
            RequestedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));

        await _bus.PublishAsync(new EmailChangeNotificationIntegrationEvent(
            UserId: user.Id.ToString(),
            OldEmail: user.Email!,
            NewEmail: request.NewEmail,
            RequestedAtUtc: DateTime.UtcNow,
            Language: _lan.GetCurrentLanguage()));
    }

    public async Task ConfirmEmailChangeAsync(ConfirmEmailChangeCommand request, CancellationToken cancellationToken)
    {
        var stored = await _redisPrimitiveService.GetStringAsync(EmailChangePendingCodeKey(request.Code), cancellationToken);
        if (stored is null)
            throw new ArgumentException(_lan.Get("Error.EmailChangeCodeExpired"));

        var parts = stored.Split('|', 3);
        var userId = parts[0];
        var newEmail = parts[1];
        var rawToken = parts[2];

        if (!string.Equals(userId, request.UserId, StringComparison.Ordinal))
            throw new ArgumentException(_lan.Get("Error.InvalidToken"));

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        await _redisPrimitiveService.RemoveAsync(EmailChangePendingCodeKey(request.Code), cancellationToken);
        await _redisPrimitiveService.RemoveAsync(EmailChangePendingUserKey(userId), cancellationToken);

        var result = await _userManager.ChangeEmailAsync(user, newEmail, rawToken);
        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.InvalidToken"));

        user.UserName = newEmail;
        await _userManager.UpdateAsync(user);

        await _redisPrimitiveService.SetStringAsync(EmailChangeCooldownKey(userId), "1", EmailChangeCooldownTtl, cancellationToken);
    }

    public IQueryable<User> GetAllUsers() => _userManager.Users.AsNoTracking();

    public async Task ChangePasswordAsync(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user is null) throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        await EnsurePasswordChangeLimitAsync(request.UserId, cancellationToken);

        var isCurrentPasswordValid = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
        if (!isCurrentPasswordValid)
            throw new ArgumentException(_lan.Get("Error.CurrentPasswordWrong"));

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.Unknown"));

        await _redisPrimitiveService.SetStringAsync(
            PasswordChangedAtKey(request.UserId),
            DateTime.UtcNow.ToString("O"),
            PasswordChangedAtTtl,
            cancellationToken);

        user.RefreshToken = null;
        user.RefreshTokenExpires = null;
        await _userManager.UpdateAsync(user);

        if (!string.IsNullOrWhiteSpace(request.Jti) && request.TokenExpiry.HasValue)
        {
            var remaining = request.TokenExpiry.Value - DateTime.UtcNow;
            if (remaining > TimeSpan.Zero)
                await _jwtBlacklist.BlacklistAsync(request.Jti, remaining, cancellationToken);
        }
    }

    private void EnsureExternalUserIsValid(ExternalUserInfo externalUser)
    {
        ArgumentNullException.ThrowIfNull(externalUser);

        if (string.IsNullOrWhiteSpace(externalUser.Provider) ||
            string.IsNullOrWhiteSpace(externalUser.ProviderUserId) ||
            string.IsNullOrWhiteSpace(externalUser.Email) ||
            !externalUser.IsEmailVerified)
        {
            throw new UnauthorizedAccessException(
                _lan.Get("Validation.InvalidCredentials"));
        }
    }

    private async Task<ExternalLoginCommandResponse> CreateAuthenticatedExternalResponseAsync(
        User user)
    {
        LoginCommandResponse login = await _jwtProvider.CreateTokenAsync(user);

        return new ExternalLoginCommandResponse(
            Status: ExternalLoginStatuses.Authenticated,
            Token: login.Token,
            RefreshToken: login.RefreshToken,
            RefreshTokenExpires: login.RefreshTokenExpires,
            UserId: login.UserId,
            FullName: user.FullName,
            Email: user.Email);
    }

    private static ExternalLoginCommandResponse CreateAccountExistsResponse(
        User user,
        ExternalUserInfo externalUser)
    {
        return new ExternalLoginCommandResponse(
            Status: ExternalLoginStatuses.AccountExists,
            Token: null,
            RefreshToken: null,
            RefreshTokenExpires: null,
            UserId: user.Id,
            FullName: string.IsNullOrWhiteSpace(user.FullName)
                ? ResolveExternalFullName(externalUser)
                : user.FullName,
            Email: user.Email ?? externalUser.Email);
    }

    private async Task EnsureAutomaticExternalLinkingIsAllowedAsync(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);

        var isDashboardAccount = roles.Any(role =>
            ApplicationRoles.DashboardRoles.Contains(
                role,
                StringComparer.OrdinalIgnoreCase));

        if (isDashboardAccount)
        {
            throw new UnauthorizedAccessException(
                _lan.Get("Validation.Unauthorized"));
        }
    }

    private async Task EnsureProviderIsNotAlreadyLinkedAsync(
        User user,
        string provider)
    {
        var existingLogins = await _userManager.GetLoginsAsync(user);

        var providerAlreadyLinked = existingLogins.Any(login =>
            string.Equals(
                login.LoginProvider,
                provider,
                StringComparison.OrdinalIgnoreCase));

        if (providerAlreadyLinked)
        {
            throw new InvalidOperationException(
                _lan.Get("Error.Unknown"));
        }
    }

    private async Task AddExternalLoginAsync(
        User user,
        string provider,
        string providerUserId)
    {
        var result = await _userManager.AddLoginAsync(
            user,
            new UserLoginInfo(
                provider,
                providerUserId,
                provider));

        EnsureIdentityResultSucceeded(result);
    }

    private async Task UpdateExternalUserProfileAsync(
        User user,
        ExternalUserInfo externalUser)
    {
        var hasChanges = false;

        if (!user.EmailConfirmed)
        {
            user.EmailConfirmed = true;
            hasChanges = true;
        }

        if (string.IsNullOrWhiteSpace(user.FullName))
        {
            user.FullName = ResolveExternalFullName(externalUser);
            hasChanges = true;
        }

        if (string.IsNullOrWhiteSpace(user.ImageUrl) &&
            !string.IsNullOrWhiteSpace(externalUser.PictureUrl))
        {
            user.ImageUrl = externalUser.PictureUrl.Trim();
            hasChanges = true;
        }

        if (!hasChanges)
            return;

        var result = await _userManager.UpdateAsync(user);
        EnsureIdentityResultSucceeded(result);
    }

    private static string ResolveExternalFullName(
        ExternalUserInfo externalUser)
    {
        if (!string.IsNullOrWhiteSpace(externalUser.FullName))
            return externalUser.FullName.Trim();

        return externalUser.Email.Trim();
    }

    private static string? NormalizeOptionalValue(string? value)
        => string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();

    private void EnsureIdentityResultSucceeded(IdentityResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        if (!result.Succeeded)
            throw new ArgumentException(_lan.Get("Error.Unknown"));
    }

    private async Task EnsurePasswordChangeLimitAsync(string userId, CancellationToken cancellationToken)
    {
        var key = PasswordChangeCountKey(userId);
        var count = await _redisPrimitiveService.IncrementAsync(key, cancellationToken: cancellationToken);

        if (count == 1)
            await _redisPrimitiveService.SetExpirationAsync(key, PasswordChangeLimitTtl, cancellationToken);

        if (count > 3)
            throw new InvalidOperationException(_lan.Get("Error.TooManyPasswordChanges"));
    }

    private async Task EnsureForgotPasswordThrottleAsync(string userId, CancellationToken cancellationToken)
    {
        var key = ForgotPasswordAttemptKey(userId);
        var count = await _redisPrimitiveService.IncrementAsync(key, cancellationToken: cancellationToken);

        if (count == 1)
            await _redisPrimitiveService.SetExpirationAsync(key, ForgotPasswordThrottleTtl, cancellationToken);

        if (count > 3)
            throw new InvalidOperationException(_lan.Get("Error.TooManyPasswordResetRequests"));
    }

    private async Task RegisterFailedLoginAttemptAsync(string email, CancellationToken cancellationToken)
    {
        var key = LoginAttemptKey(email);

        var count = await _redisPrimitiveService.IncrementAsync(key, cancellationToken: cancellationToken);

        if (count == 1)
            await _redisPrimitiveService.SetExpirationAsync(key, TimeSpan.FromMinutes(15), cancellationToken);

        if (count > 10)
            throw new InvalidOperationException(_lan.Get("Error.TooManyLoginAttempts"));
    }

    private Task ClearFailedLoginAttemptsAsync(string email, CancellationToken cancellationToken)
    {
        return _redisPrimitiveService.RemoveAsync(LoginAttemptKey(email), cancellationToken);
    }

    private static string LoginAttemptKey(string email)
    {
        var normalizedEmail = string.IsNullOrWhiteSpace(email)
            ? "unknown"
            : email.Trim().ToLowerInvariant();

        return $"security:login-attempts:{normalizedEmail}";
    }

    private static string HashRefreshToken(string rawToken)
        => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

    private static string OpaqueConfirmCodeKey(string code) => $"security:email-confirm-code:{code}";
    private static string OpaqueConfirmUserKey(string userId) => $"security:email-confirm-user:{userId}";
    private static string OpaqueResetCodeKey(string code) => $"security:pwd-reset-code:{code}";
    private static string OpaqueResetUserKey(string userId) => $"security:pwd-reset-user:{userId}";
    private static string ResendBlockKey(string userId) => $"security:resend-block:{userId}";
    private static string ResendCountKey(string userId) => $"security:resend-count:{userId}";
    private static string ForgotPasswordAttemptKey(string userId) => $"security:pwd-reset-attempts:{userId}";
    private static string PasswordChangedAtKey(string userId) => $"security:password-changed-at:{userId}";
    private static string PasswordChangeCountKey(string userId) => $"security:pwd-change-count:{userId}";
    private static string EmailChangePendingCodeKey(string code) => $"security:email-change-code:{code}";
    private static string EmailChangePendingUserKey(string userId) => $"security:email-change-user:{userId}";
    private static string EmailChangeCooldownKey(string userId) => $"security:email-change-cooldown:{userId}";
    private static readonly TimeSpan ConfirmCodeTtl = TimeSpan.FromMinutes(30);
    private static readonly TimeSpan ResendBlockTtl = TimeSpan.FromDays(14);
    private static readonly TimeSpan EmailChangePendingTtl = TimeSpan.FromMinutes(30);
    private static readonly TimeSpan EmailChangeCooldownTtl = TimeSpan.FromDays(14);
    private static readonly TimeSpan ForgotPasswordThrottleTtl = TimeSpan.FromMinutes(30);
    private static readonly TimeSpan PasswordChangeLimitTtl = TimeSpan.FromDays(14);
    private static readonly TimeSpan PasswordChangedAtTtl = TimeSpan.FromHours(1);
}
