namespace E_Commerce.Server.Shared.Contracts.Events;

public sealed record MessageSentIntegrationEvent(
    string MessageId,
    string SenderUserId,
    string SenderFullName,
    string ReceiverUserId,
    string Content,
    DateTime SentAtUtc);
