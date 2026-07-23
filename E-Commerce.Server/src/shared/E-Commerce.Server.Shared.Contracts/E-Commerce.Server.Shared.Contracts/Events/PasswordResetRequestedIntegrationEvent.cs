namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record PasswordResetRequestedIntegrationEvent(
    string UserId,
    string Email,
    string Code,
    DateTime RequestedAtUtc,
    string Language = "az");
