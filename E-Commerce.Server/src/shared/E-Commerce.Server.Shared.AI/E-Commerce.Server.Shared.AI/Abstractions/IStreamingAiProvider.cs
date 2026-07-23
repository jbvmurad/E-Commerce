using E_Commerce.Server.Shared.AI.Contracts;

namespace E_Commerce.Server.Shared.AI.Abstractions;

public interface IStreamingAiProvider : IAiProvider
{
    IAsyncEnumerable<AiStreamChunk> GenerateStreamAsync(
        AiRequest request,
        CancellationToken cancellationToken = default);
}
