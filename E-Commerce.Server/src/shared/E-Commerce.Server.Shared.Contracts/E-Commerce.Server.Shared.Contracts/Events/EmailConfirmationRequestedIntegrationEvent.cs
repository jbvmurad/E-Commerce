namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record EmailConfirmationRequestedIntegrationEvent(
    string UserId,
    string Email,
    string Code,
    DateTime RequestedAtUtc,
    string Language = "az");
