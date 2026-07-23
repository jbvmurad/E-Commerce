namespace AI.Domain.DTOs.AIAttributeDTOs;

public sealed record AIChatResponse(
    string ConversationId,
    string MessageId,
    string Content,
    IReadOnlyList<AIAttachmentResponse> Attachments,
    string? GeneratedImageUrl = null);
