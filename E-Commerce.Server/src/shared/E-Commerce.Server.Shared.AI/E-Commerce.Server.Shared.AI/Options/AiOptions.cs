namespace E_Commerce.Server.Shared.AI.Options;

public sealed class AiOptions
{
    public const string SectionName = "AI";

    public bool Enabled { get; set; }

    public int RequestTimeoutSeconds { get; set; } = 120;

    public int MaxRetries { get; set; } = 2;

    public GeminiOptions Gemini { get; set; } = new();
}
