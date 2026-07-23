using E_Commerce.Server.Shared.Caching.Abstraction;
using E_Commerce.Server.Shared.Caching.Memory;
using E_Commerce.Server.Shared.Caching.Options;
using E_Commerce.Server.Shared.Caching.Redis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace E_Commerce.Server.Shared.Caching.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSharedCaching(
        this IServiceCollection services,
        IConfiguration configuration,
        string sectionName = RedisOptions.SectionName)
    {
        services.AddOptions();
        services.Configure<RedisOptions>(configuration.GetSection(sectionName));

        var options = configuration
            .GetSection(sectionName)
            .Get<RedisOptions>() ?? new RedisOptions();

        var connectionString = configuration.GetConnectionString("redis");
        if (!string.IsNullOrWhiteSpace(connectionString))
            options.ConnectionString = connectionString;

        if (options.Enabled && !string.IsNullOrWhiteSpace(options.ConnectionString))
        {
            services.AddStackExchangeRedisCache(cacheOptions =>
            {
                cacheOptions.Configuration = options.ConnectionString;
                cacheOptions.InstanceName = options.InstanceName;
            });

            services.AddSingleton<IConnectionMultiplexer>(_ =>
                ConnectionMultiplexer.Connect(options.ConnectionString));

            services.AddSingleton(serviceProvider =>
            {
                var redisOptions = serviceProvider
                    .GetRequiredService<IOptions<RedisOptions>>()
                    .Value;

                return new RedisKeyBuilder(redisOptions.InstanceName);
            });

            services.AddSingleton<ICacheService, RedisCacheService>();
            services.AddSingleton<IRedisPrimitiveService, RedisPrimitiveService>();
            services.AddSingleton<IJwtBlacklistService, RedisJwtBlacklistService>();
        }
        else
        {
            services.AddMemoryCache();
            services.AddDistributedMemoryCache();
            services.AddSingleton<ICacheService, MemoryCacheService>();
            services.AddSingleton<IRedisPrimitiveService, InMemoryRedisPrimitiveService>();
            services.AddSingleton<IJwtBlacklistService, NullJwtBlacklistService>();
        }

        return services;
    }
}
