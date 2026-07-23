namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password);
