namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmailChange;

public sealed record ConfirmEmailChangeCommand(
    string UserId,
    string Code);
