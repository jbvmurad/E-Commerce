using E_Commerce.Server.Shared.Contracts.Events;
using E_Commerce.Server.Shared.EmailService.Services;

namespace Security.API.Messaging.Handlers;

public sealed class EmailChangeNotificationHandler
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailChangeNotificationHandler> _logger;

    public EmailChangeNotificationHandler(IEmailService emailService, ILogger<EmailChangeNotificationHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(EmailChangeNotificationIntegrationEvent message)
    {
        var ok = await _emailService.SendEmailChangeNotificationAsync(message.OldEmail, message.NewEmail, message.Language);
        if (!ok)
            throw new InvalidOperationException($"Failed to send email change notification. UserId={message.UserId}");

        _logger.LogInformation("Email change notification sent to old address. UserId={UserId}, OldEmail={OldEmail}", message.UserId, message.OldEmail);
    }
}
