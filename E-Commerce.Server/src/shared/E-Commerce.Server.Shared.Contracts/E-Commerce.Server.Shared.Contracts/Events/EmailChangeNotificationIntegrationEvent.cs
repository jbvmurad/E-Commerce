namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record EmailChangeNotificationIntegrationEvent(
    string UserId,
    string OldEmail,
    string NewEmail,
    DateTime RequestedAtUtc,
    string Language = "az");
