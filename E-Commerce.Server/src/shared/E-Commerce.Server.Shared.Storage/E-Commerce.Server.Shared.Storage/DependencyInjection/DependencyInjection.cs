using Amazon;
using Amazon.S3;
using E_Commerce.Server.Shared.Storage.Options;
using E_Commerce.Server.Shared.Storage.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace E_Commerce.Server.Shared.Storage.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddSharedStorage(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<StorageOptions>(configuration.GetSection("Storage"));

        var awsSection = configuration.GetSection("Storage:AwsS3");
        if (!awsSection.Exists())
            awsSection = configuration.GetSection("AwsS3");

        services.Configure<AwsS3Options>(awsSection);

        var storageOptions = configuration.GetSection("Storage").Get<StorageOptions>() ?? new StorageOptions();
        var awsS3Options = awsSection.Get<AwsS3Options>() ?? new AwsS3Options();

        if (string.Equals(storageOptions.Provider, "S3", StringComparison.OrdinalIgnoreCase) && awsS3Options.Enabled)
        {
            services.AddSingleton<IAmazonS3>(_ =>
            {
                var config = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(awsS3Options.Region),
                    ForcePathStyle = awsS3Options.ForcePathStyle
                };

                if (!string.IsNullOrWhiteSpace(awsS3Options.ServiceUrl))
                    config.ServiceURL = awsS3Options.ServiceUrl;

                return new AmazonS3Client(config);
            });

            services.AddSingleton<IFileStorage, S3FileStorage>();
            services.AddHostedService<S3BucketInitializerHostedService>();
        }
        else
        {
            services.AddScoped<IFileStorage, LocalFileStorage>();
        }

        return services;
    }
}
