namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiRequest(
    IReadOnlyCollection<AiMessage> Messages,
    AiGenerationOptions? GenerationOptions = null,
    string? Model = null,
    string? RequestId = null);
