using E_Commerce.Server.Shared.Caching.Abstraction;
using StackExchange.Redis;

namespace E_Commerce.Server.Shared.Caching.Redis;

public sealed class RedisPrimitiveService : IRedisPrimitiveService
{
    private readonly IDatabase _database;
    private readonly RedisKeyBuilder _keyBuilder;

    public RedisPrimitiveService(
        IConnectionMultiplexer connectionMultiplexer,
        RedisKeyBuilder keyBuilder)
    {
        _database = connectionMultiplexer.GetDatabase();
        _keyBuilder = keyBuilder;
    }

    public async Task<long> IncrementAsync(
        string key,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        var redisKey = _keyBuilder.Build(key);
        var value = await _database.StringIncrementAsync(redisKey);

        if (expiration.HasValue)
            await _database.KeyExpireAsync(redisKey, expiration.Value);

        return value;
    }

    public async Task SetStringAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        var redisKey = _keyBuilder.Build(key);
        if (expiration.HasValue)
            await _database.StringSetAsync(redisKey, value, expiration.Value);
        else
            await _database.StringSetAsync(redisKey, value);
    }

    public async Task<string?> GetStringAsync(string key, CancellationToken cancellationToken = default)
    {
        var value = await _database.StringGetAsync(_keyBuilder.Build(key));
        return value.HasValue ? value.ToString() : null;
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _database.KeyDeleteAsync(_keyBuilder.Build(key));
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
        => _database.KeyExistsAsync(_keyBuilder.Build(key));

    public async Task AddToSetAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        var redisKey = _keyBuilder.Build(key);
        await _database.SetAddAsync(redisKey, value);

        if (expiration.HasValue)
            await _database.KeyExpireAsync(redisKey, expiration.Value);
    }

    public async Task RemoveFromSetAsync(
        string key,
        string value,
        CancellationToken cancellationToken = default)
    {
        await _database.SetRemoveAsync(_keyBuilder.Build(key), value);
    }

    public async Task<IReadOnlyCollection<string>> GetSetMembersAsync(
        string key,
        CancellationToken cancellationToken = default)
    {
        var members = await _database.SetMembersAsync(_keyBuilder.Build(key));

        return members
            .Where(member => member.HasValue)
            .Select(member => member.ToString())
            .ToArray();
    }

    public async Task<long> DecrementAsync(string key, CancellationToken cancellationToken = default)
    {
        var redisKey = _keyBuilder.Build(key);
        var result = await _database.StringDecrementAsync(redisKey);
        if (result < 0)
        {
            await _database.StringSetAsync(redisKey, 0);
            return 0;
        }
        return result;
    }

    public async Task SetExpirationAsync(
        string key,
        TimeSpan expiration,
        CancellationToken cancellationToken = default)
    {
        await _database.KeyExpireAsync(_keyBuilder.Build(key), expiration);
    }
}
