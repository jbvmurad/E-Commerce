namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiGeneratedImage(
    byte[] Content,
    string ContentType,
    string FileExtension,
    string? Description = null);
