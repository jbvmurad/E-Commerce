namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiUsage(
    int InputTokens,
    int OutputTokens,
    int TotalTokens,
    int CachedInputTokens = 0);
