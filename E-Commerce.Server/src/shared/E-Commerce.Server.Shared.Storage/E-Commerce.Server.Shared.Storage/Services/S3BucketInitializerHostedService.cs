using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using E_Commerce.Server.Shared.Storage.Options;

namespace E_Commerce.Server.Shared.Storage.Services;

public sealed class S3BucketInitializerHostedService : IHostedService
{
    private readonly IAmazonS3 _s3;
    private readonly AwsS3Options _options;
    private readonly ILogger<S3BucketInitializerHostedService> _logger;

    public S3BucketInitializerHostedService(
        IAmazonS3 s3,
        IOptions<AwsS3Options> options,
        ILogger<S3BucketInitializerHostedService> logger)
    {
        _s3 = s3;
        _options = options.Value;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (!_options.Enabled || string.IsNullOrWhiteSpace(_options.BucketName))
            return;

        try
        {
            var exists = await AmazonS3Util.DoesS3BucketExistV2Async(_s3, _options.BucketName);
            if (exists)
                return;

            await _s3.PutBucketAsync(new PutBucketRequest
            {
                BucketName = _options.BucketName
            }, cancellationToken);
        }
        catch (AmazonS3Exception ex) when (
            ex.StatusCode == System.Net.HttpStatusCode.Conflict ||
            ex.ErrorCode == "BucketAlreadyOwnedByYou" ||
            ex.ErrorCode == "BucketAlreadyExists")
        {
            _logger.LogInformation("S3 bucket {BucketName} already exists.", _options.BucketName);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
