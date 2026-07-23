namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangeEmail;

public sealed record ChangeEmailCommand(
    string UserId,
    string NewEmail);
