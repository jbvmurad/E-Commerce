namespace E_Commerce.Server.Shared.EmailService.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body);
    Task<bool> SendVerificationEmailAsync(string to, string code, string language = "az");
    Task<bool> SendPasswordResetEmailAsync(string to, string code, string language = "az");
    Task<bool> SendDeletionNotificationEmailAsync(string to, string language = "az");
    Task<bool> SendEmailChangeVerificationAsync(string to, string userId, string code, string language = "az");
    Task<bool> SendEmailChangeNotificationAsync(string to, string newEmail, string language = "az");
}
