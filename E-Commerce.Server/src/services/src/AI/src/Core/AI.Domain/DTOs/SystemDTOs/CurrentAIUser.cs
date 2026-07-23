namespace AI.Domain.DTOs.SystemDTOs;

public sealed record CurrentAIUser(
    string? UserId,
    string? SessionId,
    bool IsAuthenticated);
