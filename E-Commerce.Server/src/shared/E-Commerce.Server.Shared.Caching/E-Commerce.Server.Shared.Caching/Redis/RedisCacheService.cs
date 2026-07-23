using E_Commerce.Server.Shared.Caching.Abstraction;
using E_Commerce.Server.Shared.Caching.Options;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace E_Commerce.Server.Shared.Caching.Redis;

public sealed class RedisCacheService :ICacheService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };
    private readonly IDistributedCache _cache;
    private readonly RedisOptions _options;

    public RedisCacheService(IDistributedCache cache, IOptions<RedisOptions> options)
    {
        _cache = cache;
        _options = options.Value;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var value= await _cache.GetStringAsync(key, cancellationToken);
        if (string.IsNullOrWhiteSpace(value)) return default;
        return JsonSerializer.Deserialize<T>(value, JsonOptions);
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var cached = await GetAsync<T>(key, cancellationToken);

        if (cached is not null)
            return cached;

        var value = await factory();
        await SetAsync(key, value, expiration, cancellationToken);

        return value;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => _cache.RemoveAsync(key, cancellationToken);

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(value, JsonOptions);

        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(_options.DefaultExpirationMinutes)
        };

        await _cache.SetStringAsync(key, json, cacheOptions, cancellationToken);
    }
}
