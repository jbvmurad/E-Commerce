namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record AccountDeletedIntegrationEvent(
    string UserId,
    string Email,
    DateTime DeletedAtUtc,
    string Language = "az");
