using AutoMapper;
using AutoMapper.QueryableExtensions;
using E_Commerce.Server.Shared.Authorization.Permissions;
using E_Commerce.Server.Shared.Authorization.Policies;
using E_Commerce.Server.Shared.Authorization.RateLimiting;
using E_Commerce.Server.Shared.Localization.Localizations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.RateLimiting;
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
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;
using Security.Presentation.Controllers.AbstractController;
using Security.Presentation.Services.AuthCookies;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Wolverine;

namespace Security.Presentation.Controllers.UserControllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : APIController
{
    private readonly IAuthService _authService;
    private readonly IAuthCookieService _authCookieService;
    private readonly IMapper _mapper;
    private readonly ILocalizationService _lan;

    public AuthController(IMessageBus bus, IAuthService authService, IAuthCookieService authCookieService, IMapper mapper, ILocalizationService lan) : base(bus)
    {
        _authService = authService;
        _authCookieService = authCookieService;
        _mapper = mapper;
        _lan = lan;
    }

    [HasPermission(ApplicationPermissions.Users.Read)]
    [HttpGet]
    public async Task<IActionResult> GetAll(ODataQueryOptions<User> options, CancellationToken cancellationToken)
    {
        IQueryable<User> query = _authService.GetAllUsers();

        query = (IQueryable<User>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<UserResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HasPermission(ApplicationPermissions.Users.Read)]
    [HttpGet("search")]
    public async Task<IActionResult> Search(ODataQueryOptions<User> options, CancellationToken cancellationToken)
    {
        IQueryable<User> query = _authService.GetAllUsers();

        query = (IQueryable<User>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<UserResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.Register)]
    public async Task<IActionResult> Register(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("confirm-email")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.ConfirmEmail)]
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("resend-confirmation")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.ResendConfirmationEmail)]
    public async Task<IActionResult> ResendConfirmation(ResendEmailConfirmationCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.ForgotPassword)]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.ResetPassword)]
    public async Task<IActionResult> ResetPassword(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.Login)]
    public async Task<IActionResult> Login(LoginCommand request, CancellationToken cancellationToken)
    {
        LoginCommandResponse response = await _bus.InvokeAsync<LoginCommandResponse>(request);

        if (!string.IsNullOrWhiteSpace(response.Token) && !string.IsNullOrWhiteSpace(response.RefreshToken))
        {
            _authCookieService.SetAuthCookies(Response, response.Token, response.RefreshToken, response.RefreshTokenExpires);
        }

        return Ok(response);
    }


    [HttpPost("external-login")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.Login)]
    public async Task<IActionResult> ExternalLogin(
        ExternalLoginCommand request,
        CancellationToken cancellationToken)
    {
        ExternalLoginCommandResponse response =
            await _bus.InvokeAsync<ExternalLoginCommandResponse>(
                request,
                cancellationToken);

        if (string.Equals(
                response.Status,
                ExternalLoginStatuses.Authenticated,
                StringComparison.Ordinal) &&
            !string.IsNullOrWhiteSpace(response.Token) &&
            !string.IsNullOrWhiteSpace(response.RefreshToken))
        {
            _authCookieService.SetAuthCookies(
                Response,
                response.Token,
                response.RefreshToken,
                response.RefreshTokenExpires);
        }

        return Ok(response);
    }


    [HttpPost("logout")]
    [EnableRateLimiting(AuthRateLimitPolicies.Logout)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        var jti = User.FindFirstValue(JwtRegisteredClaimNames.Jti);

        DateTime? tokenExpiry = null;
        var expClaim = User.FindFirstValue(JwtRegisteredClaimNames.Exp);
        if (long.TryParse(expClaim, out var expSeconds))
            tokenExpiry = DateTimeOffset.FromUnixTimeSeconds(expSeconds).UtcDateTime;

        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            new LogoutCommand(userId, jti, tokenExpiry), cancellationToken);

        _authCookieService.ClearAuthCookies(Response);

        return Ok(response);
    }

    [HttpPost("createtoken")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.RefreshToken)]
    public async Task<IActionResult> CreateTokenByRefreshToken(CreateNewTokenByRefreshTokenCommand request, CancellationToken cancellationToken)
    {
        LoginCommandResponse response = await _bus.InvokeAsync<LoginCommandResponse>(request);

        if (!string.IsNullOrWhiteSpace(response.Token) && !string.IsNullOrWhiteSpace(response.RefreshToken))
        {
            _authCookieService.SetAuthCookies(Response, response.Token, response.RefreshToken, response.RefreshTokenExpires);
        }
        else
        {
            _authCookieService.ClearAuthCookies(Response);
        }

        return Ok(response);
    }


    [HttpPost("change-email")]
    [EnableRateLimiting(AuthRateLimitPolicies.ChangeEmail)]
    public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest body, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            new ChangeEmailCommand(userId, body.NewEmail), cancellationToken);
        return Ok(response);
    }

    [HttpPost("confirm-email-change")]
    [AllowAnonymous]
    [EnableRateLimiting(AuthRateLimitPolicies.ConfirmEmailChange)]
    public async Task<IActionResult> ConfirmEmailChange(ConfirmEmailChangeCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HttpPost("change-password")]
    [EnableRateLimiting(AuthRateLimitPolicies.ChangePassword)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest body, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        var jti = User.FindFirstValue(JwtRegisteredClaimNames.Jti);

        DateTime? tokenExpiry = null;
        var expClaim = User.FindFirstValue(JwtRegisteredClaimNames.Exp);
        if (long.TryParse(expClaim, out var expSeconds))
            tokenExpiry = DateTimeOffset.FromUnixTimeSeconds(expSeconds).UtcDateTime;

        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            new ChangePasswordCommand(userId, body.CurrentPassword, body.NewPassword, body.ConfirmPassword, jti, tokenExpiry),
            cancellationToken);

        _authCookieService.ClearAuthCookies(Response);

        return Ok(response);
    }

    [HasPermission(ApplicationPermissions.Users.Delete)]
    [HttpDelete]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        DeleteUserCommand request = new(id.ToString());
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }
}
