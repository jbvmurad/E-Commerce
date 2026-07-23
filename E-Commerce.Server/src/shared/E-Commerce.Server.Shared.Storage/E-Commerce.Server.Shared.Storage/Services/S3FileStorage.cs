using Amazon.S3;
using Amazon.S3.Model;
using E_Commerce.Server.Shared.Localization.Localizations;
using E_Commerce.Server.Shared.Storage.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.Storage.Services;

public sealed class S3FileStorage : IFileStorage
{
    private readonly IAmazonS3 _s3;
    private readonly AwsS3Options _options;
    private readonly ILocalizationService _lan;
    private readonly SemaphoreSlim _bucketLock = new(1, 1);
    private bool _bucketEnsured;

    public S3FileStorage(
        IAmazonS3 s3,
        IOptions<AwsS3Options> options,
        ILocalizationService lan)
    {
        _s3 = s3;
        _options = options.Value;
        _lan = lan;
    }

    public async Task<string> SaveImageAsync(
        IFormFile media,
        CancellationToken cancellationToken,
        string? folder = null,
        long targetMaxBytes = 2 * 1024 * 1024)
    {
        FileValidation.ValidateImage(media, _lan);
        await EnsureBucketExistsAsync(cancellationToken);

        folder ??= "uploads/profile-images";

        var key = BuildKey(folder, ".jpg");

        var maxDimension =
            folder.Contains(
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

        await using var buffer =
            new MemoryStream(
                optimizedBytes,
                writable: false);

        var put = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = key,
            InputStream = buffer,
            ContentType = "image/jpeg"
        };

        if (_options.MakePublic)
            put.CannedACL = S3CannedACL.PublicRead;

        await _s3.PutObjectAsync(
            put,
            cancellationToken);

        return BuildPublicUrl(key);
    }

    public async Task<string> SaveMediaAsync(
        IFormFile media,
        string folder,
        CancellationToken cancellationToken)
    {
        FileValidation.ValidatePostMedia(media, _lan);
        await EnsureBucketExistsAsync(cancellationToken);

        var ext =
            Path.GetExtension(media.FileName)
                .ToLowerInvariant();

        var normalKey =
            BuildKey(folder, ext);

        var normalPut = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = normalKey,
            InputStream = media.OpenReadStream(),
            ContentType = media.ContentType
        };

        if (_options.MakePublic)
            normalPut.CannedACL = S3CannedACL.PublicRead;

        await _s3.PutObjectAsync(
            normalPut,
            cancellationToken);

        return BuildPublicUrl(normalKey);
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

        await EnsureBucketExistsAsync(cancellationToken);

        var extension = Path.GetExtension(
            Path.GetFileName(file.FileName)).ToLowerInvariant();

        var key = BuildKey(folder, extension);

        await using var input = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = _options.BucketName,
            Key = key,
            InputStream = input,
            ContentType = file.ContentType
        };

        if (_options.MakePublic)
            request.CannedACL = S3CannedACL.PublicRead;

        await _s3.PutObjectAsync(request, cancellationToken);

        return BuildPublicUrl(key);
    }

    public async Task TryDeleteAsync(
        string? mediaUrl,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(mediaUrl))
            return;

        try
        {
            var uri =
                new Uri(
                    mediaUrl,
                    UriKind.Absolute);

            var key =
                uri.AbsolutePath.TrimStart('/');

            if (string.IsNullOrWhiteSpace(key))
                return;

            await _s3.DeleteObjectAsync(
                new DeleteObjectRequest
                {
                    BucketName = _options.BucketName,
                    Key = key
                },
                cancellationToken);
        }
        catch
        {
        }
    }

    private async Task EnsureBucketExistsAsync(
        CancellationToken cancellationToken)
    {
        if (_bucketEnsured || !_options.Enabled)
            return;

        await _bucketLock.WaitAsync(cancellationToken);

        try
        {
            if (_bucketEnsured)
                return;

            try
            {
                await _s3.PutBucketAsync(
                    new PutBucketRequest
                    {
                        BucketName = _options.BucketName
                    },
                    cancellationToken);
            }
            catch (AmazonS3Exception ex) when (
                ex.StatusCode ==
                    System.Net.HttpStatusCode.Conflict
                || ex.ErrorCode ==
                    "BucketAlreadyOwnedByYou"
                || ex.ErrorCode ==
                    "BucketAlreadyExists")
            {
            }

            _bucketEnsured = true;
        }
        finally
        {
            _bucketLock.Release();
        }
    }

    private string BuildKey(
        string folder,
        string extension)
    {
        var keyPrefix =
            string.IsNullOrWhiteSpace(_options.KeyPrefix)
                ? string.Empty
                : _options.KeyPrefix
                    .Replace('\\', '/')
                    .Trim('/');

        var path =
            folder.Replace('\\', '/').Trim('/');

        var fileName =
            $"{Guid.NewGuid():N}{extension}";

        return string.IsNullOrWhiteSpace(keyPrefix)
            ? $"{path}/{fileName}"
            : $"{keyPrefix}/{path}/{fileName}";
    }

    private string BuildPublicUrl(string key)
    {
        var baseUrl = _options.PublicBaseUrl;

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            baseUrl =
                $"https://{_options.BucketName}.s3.{_options.Region}.amazonaws.com";
        }

        return $"{baseUrl.TrimEnd('/')}/{key}";
    }
}
