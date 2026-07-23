using E_Commerce.Server.Shared.ExternalAuthentication.Providers.Google;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.ExternalAuthentication.Validation;

internal sealed class GoogleAuthOptionsValidator
    : IValidateOptions<GoogleAuthOptions>
{
    public ValidateOptionsResult Validate(
        string? name,
        GoogleAuthOptions options)
    {
        if (options is null)
        {
            return ValidateOptionsResult.Fail(
                "ExternalAuthentication:Google configuration is missing.");
        }

        if (!options.Enabled)
            return ValidateOptionsResult.Success;

        if (string.IsNullOrWhiteSpace(options.ClientId))
        {
            return ValidateOptionsResult.Fail(
                "ExternalAuthentication:Google:ClientId is required when Google authentication is enabled.");
        }

        return ValidateOptionsResult.Success;
    }
}
