using AI.Domain.Enums;

namespace AI.Domain.DTOs.AIAttributeDTOs;

public sealed record AIMessageResponse(
    string Id,
    string ConversationId,
    AIMessageRole Role,
    string Content,
    int? InputTokenCount,
    int? OutputTokenCount,
    DateTime CreatedAt,
    IReadOnlyList<AIAttachmentResponse> Attachments);
