namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResetPassword;

public sealed record ResetPasswordCommand(
    string Code,
    string NewPassword,
    string ConfirmPassword);
