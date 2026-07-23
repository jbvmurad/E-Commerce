namespace E_Commerce.Server.Shared.EmailService.Options;

public sealed record EmailTemplateOptions(
    string BaseUrl,
    string VerifyEmailPath,
    string ResetPasswordPath,
    string ChangeEmailPath = "/change-email");
