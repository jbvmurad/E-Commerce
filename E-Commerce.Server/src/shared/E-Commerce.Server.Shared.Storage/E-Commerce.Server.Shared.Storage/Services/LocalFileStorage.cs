using E_Commerce.Server.Shared.Localization.Localizations;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Storage.Services;

public sealed class LocalFileStorage : IFileStorage
{
    private readonly IWebHostEnvironment _env;
    private readonly ILocalizationService _lan;

    public LocalFileStorage(
        IWebHostEnvironment env,
        ILocalizationService lan)
    {
        _env = env;
        _lan = lan;
    }

    public async Task<string> SaveImageAsync(
        IFormFile media,
        CancellationToken cancellationToken,
        string? folder = null,
        long targetMaxBytes = 2 * 1024 * 1024)
    {
        FileValidation.ValidateImage(media, _lan);

        folder ??= "uploads/profile-images";

        var normalizedFolder = NormalizeFolder(folder);

        var rootFolder = Path.Combine(
            _env.ContentRootPath,
            normalizedFolder.Replace(
                '/',
                Path.DirectorySeparatorChar));

        Directory.CreateDirectory(rootFolder);

        var fileName = $"{Guid.NewGuid():N}.jpg";
        var filePath = Path.Combine(rootFolder, fileName);

        var maxDimension = normalizedFolder.Contains(
            "profile",
            StringComparison.OrdinalIgnoreCase)
                ? 768
                : 1600;

        var optimizedBytes =
            await MediaOptimization.OptimizeImageAsync(
                media,
                maxDimension,
                targetMaxBytes,
                cancellationToken);

        await File.WriteAllBytesAsync(
            filePath,
            optimizedBytes,
            cancellationToken);

        return ToPublicPath(
            normalizedFolder,
            fileName);
    }

    public async Task<string> SaveMediaAsync(
        IFormFile media,
        string folder,
        CancellationToken cancellationToken)
    {
        FileValidation.ValidatePostMedia(media, _lan);

        var normalizedFolder = NormalizeFolder(folder);

        var rootFolder = Path.Combine(
            _env.ContentRootPath,
            normalizedFolder.Replace(
                '/',
                Path.DirectorySeparatorChar));

        Directory.CreateDirectory(rootFolder);

        var ext =
            Path.GetExtension(media.FileName)
                .ToLowerInvariant();

        var copyFileName =
            $"{Guid.NewGuid():N}{ext}";

        var copyFilePath =
            Path.Combine(rootFolder, copyFileName);

        await using var output =
            File.Create(copyFilePath);

        await media.CopyToAsync(
            output,
            cancellationToken);

        return ToPublicPath(
            normalizedFolder,
            copyFileName);
    }

    public async Task<string> SaveFileAsync(
        IFormFile file,
        string folder,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(file);

        if (file.Length == 0)
        {
            throw FileValidation.ToValidationException(
                _lan.Get("Validation.EmptyFileNotAllowed"));
        }

        var normalizedFolder = NormalizeFolder(folder);
        var rootFolder = Path.Combine(
            _env.ContentRootPath,
            normalizedFolder.Replace(
                '/',
                Path.DirectorySeparatorChar));

        Directory.CreateDirectory(rootFolder);

        var extension = Path.GetExtension(
            Path.GetFileName(file.FileName)).ToLowerInvariant();

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(rootFolder, fileName);

        await using var input = file.OpenReadStream();
        await using var output = new FileStream(
            filePath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None,
            bufferSize: 81920,
            useAsync: true);

        await input.CopyToAsync(output, cancellationToken);

        return ToPublicPath(normalizedFolder, fileName);
    }

    public Task TryDeleteAsync(
        string? mediaUrl,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(mediaUrl))
            return Task.CompletedTask;

        var normalized =
            mediaUrl.Replace('\\', '/').TrimStart('/');

        if (normalized.Contains(
                "..",
                StringComparison.Ordinal))
        {
            return Task.CompletedTask;
        }

        var filePath = Path.Combine(
            _env.ContentRootPath,
            normalized.Replace(
                '/',
                Path.DirectorySeparatorChar));

        TryDelete(filePath);

        return Task.CompletedTask;
    }

    private static void TryDelete(string path)
    {
        try
        {
            if (File.Exists(path))
                File.Delete(path);
        }
        catch
        {
        }
    }

    private static string NormalizeFolder(string folder)
    {
        var normalized =
            folder.Replace('\\', '/').Trim('/');

        return string.IsNullOrWhiteSpace(normalized)
            ? "uploads"
            : normalized;
    }

    private static string ToPublicPath(
        string folder,
        string fileName)
    {
        return $"/{folder.Trim('/')}/{fileName}";
    }
}