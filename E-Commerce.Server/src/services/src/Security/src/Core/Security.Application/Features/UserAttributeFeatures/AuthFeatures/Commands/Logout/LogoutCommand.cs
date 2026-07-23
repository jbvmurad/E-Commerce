namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Logout;

public sealed record LogoutCommand(string UserId, string? Jti = null, DateTime? TokenExpiry = null);
