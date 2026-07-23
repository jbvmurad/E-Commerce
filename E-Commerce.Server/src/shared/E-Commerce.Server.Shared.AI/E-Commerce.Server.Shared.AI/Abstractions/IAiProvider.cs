using E_Commerce.Server.Shared.AI.Contracts;

namespace E_Commerce.Server.Shared.AI.Abstractions;

public interface IAiProvider
{
    Task<AiResponse> GenerateAsync(
        AiRequest request,
        CancellationToken cancellationToken = default);

    Task<AiResponse> GenerateAsync(
        AiRequest request,
        IReadOnlyCollection<AiFile> files,
        CancellationToken cancellationToken = default);

    Task<AiGeneratedImage> GenerateImageAsync(
        string prompt,
        CancellationToken cancellationToken = default);
}
