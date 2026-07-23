namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record EmailChangeRequestedIntegrationEvent(
    string UserId,
    string NewEmail,
    string Code,
    DateTime RequestedAtUtc,
    string Language = "az");
