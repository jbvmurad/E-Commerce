namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record CommentAddedIntegrationEvent(
    string PostMediaId,
    string CommentId,
    string CommenterUserId,
    string CommenterFullName,
    string Text,
    string PostOwnerUserId,
    DateTime CreatedAtUtc);
