using E_Commerce.Server.Shared.EmailService.Options;
using E_Commerce.Server.Shared.EmailService.Renderers;
using E_Commerce.Server.Shared.Localization.Localizations;
using System.Net;
using System.Net.Mail;

namespace E_Commerce.Server.Shared.EmailService.Services;

public sealed class DefaultEmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly EmailTemplateOptions _templateOptions;
    private readonly IEmailTemplateRenderer _renderer;
    private readonly ILocalizationService _lan;
    private readonly SmtpClient _smtpClient;

    public DefaultEmailService(
        EmailOptions options,
        EmailTemplateOptions templateOptions,
        IEmailTemplateRenderer renderer,
        ILocalizationService lan)
    {
        _options = options;
        _templateOptions = templateOptions;
        _renderer = renderer;
        _lan = lan;

        _smtpClient = new SmtpClient(_options.Host)
        {
            EnableSsl = _options.EnableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Port = _options.Port,
            Credentials = new NetworkCredential(_options.Username, _options.AppPassword)
        };
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string body)
    {
        using var message = new MailMessage
        {
            From = new MailAddress(_options.From),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        message.To.Add(to);

        await _smtpClient.SendMailAsync(message);

        return true;
    }

    public async Task<bool> SendVerificationEmailAsync(string to, string code, string language = "az")
    {
        var link = BuildUrl(_templateOptions.VerifyEmailPath, ("code", code));
        var model = new
        {
            Header = _lan.GetWithLanguage("Email.VerifyAccount.Header", language),
            Instruction = _lan.GetWithLanguage("Email.VerifyAccount.Instruction", language),
            LinkText = _lan.GetWithLanguage("Email.VerifyAccount.LinkText", language),
            Fallback = _lan.GetWithLanguage("Email.VerifyAccount.Fallback", language),
            VerificationLink = link
        };
        var body = await _renderer.RenderAsync("VerifyEmail", model);
        var subject = _lan.GetWithLanguage("Email.VerifyAccount.Subject", language);
        return await SendEmailAsync(to, subject, body);
    }

    public async Task<bool> SendPasswordResetEmailAsync(string to, string code, string language = "az")
    {
        var link = BuildUrl(_templateOptions.ResetPasswordPath, ("code", code));
        var model = new
        {
            Header = _lan.GetWithLanguage("Email.ResetPassword.Header", language),
            Instruction = _lan.GetWithLanguage("Email.ResetPassword.Instruction", language),
            LinkText = _lan.GetWithLanguage("Email.ResetPassword.LinkText", language),
            Fallback = _lan.GetWithLanguage("Email.ResetPassword.Fallback", language),
            ResetLink = link
        };
        var body = await _renderer.RenderAsync("ResetPassword", model);
        var subject = _lan.GetWithLanguage("Email.ResetPassword.Subject", language);
        return await SendEmailAsync(to, subject, body);
    }

    public async Task<bool> SendDeletionNotificationEmailAsync(string to, string language = "az")
    {
        var model = new
        {
            Header = _lan.GetWithLanguage("Email.AccountDeleted.Header", language),
            BodyText = _lan.GetWithLanguage("Email.AccountDeleted.Body", language)
        };
        var body = await _renderer.RenderAsync("AccountDeleted", model);
        var subject = _lan.GetWithLanguage("Email.AccountDeleted.Subject", language);
        return await SendEmailAsync(to, subject, body);
    }

    public async Task<bool> SendEmailChangeVerificationAsync(string to, string userId, string code, string language = "az")
    {
        var link = BuildUrl(
            _templateOptions.ChangeEmailPath,
            ("userId", userId),
            ("code", code));
        var model = new
        {
            Header = _lan.GetWithLanguage("Email.ChangeEmail.Header", language),
            Instruction = _lan.GetWithLanguage("Email.ChangeEmail.Instruction", language),
            LinkText = _lan.GetWithLanguage("Email.ChangeEmail.LinkText", language),
            Fallback = _lan.GetWithLanguage("Email.ChangeEmail.Fallback", language),
            ChangeLink = link
        };
        var body = await _renderer.RenderAsync("EmailChangeVerification", model);
        var subject = _lan.GetWithLanguage("Email.ChangeEmail.Subject", language);
        return await SendEmailAsync(to, subject, body);
    }

    public async Task<bool> SendEmailChangeNotificationAsync(string to, string newEmail, string language = "az")
    {
        var bodyText = _lan.GetWithLanguage("Email.ChangeEmailNotification.Body", language)
            .Replace("{NewEmail}", newEmail);
        var model = new
        {
            Header = _lan.GetWithLanguage("Email.ChangeEmailNotification.Header", language),
            BodyText = bodyText
        };
        var body = await _renderer.RenderAsync("EmailChangeNotification", model);
        var subject = _lan.GetWithLanguage("Email.ChangeEmailNotification.Subject", language);
        return await SendEmailAsync(to, subject, body);
    }

    private string BuildUrl(
        string path,
        params (string Name, string Value)[] queryParameters)
    {
        var baseUrl = (_templateOptions.BaseUrl ?? string.Empty).TrimEnd('/');
        var cleanPath = (path ?? string.Empty).TrimStart('/');
        var query = string.Join(
            "&",
            queryParameters.Select(parameter =>
                $"{Uri.EscapeDataString(parameter.Name)}={Uri.EscapeDataString(parameter.Value)}"));

        return $"{baseUrl}/{cleanPath}?{query}";
    }
}
