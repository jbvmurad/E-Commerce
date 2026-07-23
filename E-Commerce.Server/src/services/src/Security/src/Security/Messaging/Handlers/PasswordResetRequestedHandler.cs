using E_Commerce.Server.Shared.Contracts.Events;
using E_Commerce.Server.Shared.EmailService.Services;

namespace Security.API.Messaging.Handlers;

public sealed class PasswordResetRequestedHandler
{
    private readonly IEmailService _emailService;
    private readonly ILogger<PasswordResetRequestedHandler> _logger;

    public PasswordResetRequestedHandler(IEmailService emailService, ILogger<PasswordResetRequestedHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(PasswordResetRequestedIntegrationEvent message)
    {
        var ok = await _emailService.SendPasswordResetEmailAsync(message.Email, message.Code, message.Language);
        if (!ok)
            throw new InvalidOperationException($"Failed to send password reset email. UserId={message.UserId}");

        _logger.LogInformation("Password reset email sent. UserId={UserId}, Email={Email}", message.UserId, message.Email);
    }
}
