using E_Commerce.Server.Shared.Contracts.Events;
using E_Commerce.Server.Shared.EmailService.Services;

namespace Security.API.Messaging.Handlers;

public sealed class EmailConfirmationRequestedHandler
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailConfirmationRequestedHandler> _logger;

    public EmailConfirmationRequestedHandler(IEmailService emailService, ILogger<EmailConfirmationRequestedHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(EmailConfirmationRequestedIntegrationEvent message)
    {
        var ok = await _emailService.SendVerificationEmailAsync(message.Email, message.Code, message.Language);
        if (!ok)
            throw new InvalidOperationException($"Failed to send verification email. UserId={message.UserId}");

        _logger.LogInformation("Verification email sent. UserId={UserId}, Email={Email}", message.UserId, message.Email);
    }
}
