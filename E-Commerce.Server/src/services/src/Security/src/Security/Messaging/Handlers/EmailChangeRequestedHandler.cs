using E_Commerce.Server.Shared.Contracts.Events;
using E_Commerce.Server.Shared.EmailService.Services;

namespace Security.API.Messaging.Handlers;

public sealed class EmailChangeRequestedHandler
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailChangeRequestedHandler> _logger;

    public EmailChangeRequestedHandler(IEmailService emailService, ILogger<EmailChangeRequestedHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(EmailChangeRequestedIntegrationEvent message)
    {
        var ok = await _emailService.SendEmailChangeVerificationAsync(
            message.NewEmail,
            message.UserId,
            message.Code,
            message.Language);
        if (!ok)
            throw new InvalidOperationException($"Failed to send email change verification. UserId={message.UserId}");

        _logger.LogInformation("Email change verification sent. UserId={UserId}, NewEmail={NewEmail}", message.UserId, message.NewEmail);
    }
}
