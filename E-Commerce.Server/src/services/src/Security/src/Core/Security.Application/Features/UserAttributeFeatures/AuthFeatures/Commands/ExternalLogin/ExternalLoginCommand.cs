namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ExternalLogin;

public static class ExternalLoginFlows
{
    public const string Login = "Login";
    public const string Register = "Register";
}

public sealed record ExternalLoginCommand(
    string Provider,
    string Credential,
    string? RedirectUri = null,
    string Flow = ExternalLoginFlows.Login);
