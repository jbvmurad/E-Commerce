namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiGenerationOptions(
    double? Temperature = null,
    double? TopP = null,
    int? TopK = null,
    int? MaxOutputTokens = null,
    IReadOnlyCollection<string>? StopSequences = null,
    AiResponseFormat ResponseFormat = AiResponseFormat.Text,
    string? ResponseJsonSchema = null);
