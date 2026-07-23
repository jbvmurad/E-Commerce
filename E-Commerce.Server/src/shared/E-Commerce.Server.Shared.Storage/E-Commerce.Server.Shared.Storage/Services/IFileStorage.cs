using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Storage.Services;

public interface IFileStorage
{
    Task<string> SaveImageAsync(
        IFormFile media,
        CancellationToken cancellationToken,
        string? folder = null,
        long targetMaxBytes = 2 * 1024 * 1024);

    Task<string> SaveMediaAsync(
        IFormFile media,
        string folder,
        CancellationToken cancellationToken);

    Task<string> SaveFileAsync(
        IFormFile file,
        string folder,
        CancellationToken cancellationToken);

    Task TryDeleteAsync(string? mediaUrl, CancellationToken cancellationToken);
}
