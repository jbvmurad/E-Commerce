using E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;
using E_Commerce.Server.Shared.ExternalAuthentication.Constants;
using E_Commerce.Server.Shared.ExternalAuthentication.Contracts;
using E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.ExternalAuthentication.Providers.Google;

internal sealed class GoogleExternalAuthProvider
    : IExternalAuthProvider
{
    private const string InvalidCredentialErrorCode =
        "external_auth.google.invalid_credential";

    private readonly GoogleAuthOptions _options;

    public GoogleExternalAuthProvider(
        IOptions<GoogleAuthOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);
        _options = options.Value;
    }

    public string ProviderName => ExternalAuthProviderNames.Google;

    public async Task<ExternalUserInfo> ValidateAsync(
        ExternalAuthCredential credential,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(credential);
        cancellationToken.ThrowIfCancellationRequested();

        EnsureConfigured();

        if (string.IsNullOrWhiteSpace(credential.Value))
        {
            throw new ArgumentException(
                "Google ID token is required.",
                nameof(credential));
        }

        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                credential.Value,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_options.ClientId]
                });
        }
        catch (InvalidJwtException exception)
        {
            throw new ExternalAuthProviderException(
                ProviderName,
                "Google ID token is invalid.",
                InvalidCredentialErrorCode,
                exception);
        }

        cancellationToken.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(payload.Subject))
        {
            throw CreateInvalidPayloadException(
                "Google user identifier is missing.");
        }

        if (string.IsNullOrWhiteSpace(payload.Email))
        {
            throw CreateInvalidPayloadException(
                "Google email address is missing.");
        }

        if (payload.EmailVerified is not true)
        {
            throw CreateInvalidPayloadException(
                "Google email address is not verified.");
        }

        return new ExternalUserInfo(
            Provider: ProviderName,
            ProviderUserId: payload.Subject,
            Email: payload.Email,
            IsEmailVerified: true,
            FullName: ResolveFullName(payload),
            PictureUrl: NormalizeOptionalValue(payload.Picture));
    }

    private void EnsureConfigured()
    {
        if (!_options.Enabled)
        {
            throw new ExternalAuthConfigurationException(
                "Google external authentication is disabled.");
        }

        if (string.IsNullOrWhiteSpace(_options.ClientId))
        {
            throw new ExternalAuthConfigurationException(
                "Google Client ID is not configured.");
        }
    }

    private static string ResolveFullName(
        GoogleJsonWebSignature.Payload payload)
    {
        if (!string.IsNullOrWhiteSpace(payload.Name))
        {
            return payload.Name.Trim();
        }

        var fullName = string.Join(
            " ",
            new[]
            {
                payload.GivenName,
                payload.FamilyName
            }
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value.Trim()));

        return string.IsNullOrWhiteSpace(fullName)
            ? payload.Email.Trim()
            : fullName;
    }

    private static string? NormalizeOptionalValue(string? value)
        => string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();

    private ExternalAuthProviderException CreateInvalidPayloadException(
        string message)
        => new(
            ProviderName,
            message,
            InvalidCredentialErrorCode);
}
