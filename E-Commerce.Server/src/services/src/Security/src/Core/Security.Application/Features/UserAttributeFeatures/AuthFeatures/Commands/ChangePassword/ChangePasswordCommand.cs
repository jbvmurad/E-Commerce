namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangePassword;

public sealed record ChangePasswordCommand(
    string UserId,
    string CurrentPassword,
    string NewPassword,
    string ConfirmPassword,
    string? Jti,
    DateTime? TokenExpiry);
