namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record ChatMessageCreatedIntegrationEvent(
    string ConversationId,
    string MessageId,
    string SenderUserId,
    string SenderFullName,
    IReadOnlyCollection<string> ReceiverUserIds,
    string MessageType,
    string? TextPreview,
    DateTime CreatedAtUtc);
