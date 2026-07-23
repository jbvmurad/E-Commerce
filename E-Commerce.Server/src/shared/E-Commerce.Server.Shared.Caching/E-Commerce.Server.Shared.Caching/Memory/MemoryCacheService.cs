using E_Commerce.Server.Shared.Caching.Abstraction;
using E_Commerce.Server.Shared.Caching.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.Caching.Memory;

public sealed class MemoryCacheService :ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly RedisOptions _options;
    public MemoryCacheService(IMemoryCache cache, IOptions<RedisOptions> options)
    {
        _cache = cache;
        _options = options.Value;
    }

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        _cache.TryGetValue(key,out T? value);
        return Task.FromResult(value);
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var cached=await GetAsync<T>(key, cancellationToken);
        if (cached is not null) return cached;
        
        var value = await factory();
        await SetAsync(key, value, expiration, cancellationToken);
        return value;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        _cache.Remove(key);
        return Task.CompletedTask;
    }

    public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        _cache.Set(key,value,expiration ?? TimeSpan.FromMinutes(_options.DefaultExpirationMinutes));  
        return Task.FromResult(value);
    }
}
