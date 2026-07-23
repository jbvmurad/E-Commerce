using AI.Domain.Enums;

namespace AI.Domain.DTOs.AIAttributeDTOs;

public sealed record AIConversationResponse(
    string Id,
    string? Title,
    AIConversationType ConversationType,
    bool IsArchived,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int MessageCount);
