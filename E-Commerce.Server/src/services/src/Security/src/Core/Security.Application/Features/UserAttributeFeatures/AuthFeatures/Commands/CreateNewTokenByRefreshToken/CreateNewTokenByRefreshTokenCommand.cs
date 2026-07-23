namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.CreateNewTokenByRefreshToken;

public sealed record CreateNewTokenByRefreshTokenCommand(
    string UserId,
    string RefreshToken);
