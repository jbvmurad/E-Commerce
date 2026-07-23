namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiStreamChunk(
    string ContentDelta,
    string Model,
    bool IsCompleted = false,
    string? FinishReason = null,
    AiUsage? Usage = null,
    string? RequestId = null);
