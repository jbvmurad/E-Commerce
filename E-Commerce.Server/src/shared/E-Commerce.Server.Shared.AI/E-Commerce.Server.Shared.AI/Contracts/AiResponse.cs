namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiResponse(
    string Content,
    string Model,
    string? FinishReason = null,
    AiUsage? Usage = null,
    string? RequestId = null);
