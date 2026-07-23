using E_Commerce.Server.Shared.Caching.Abstraction;
using System.Collections.Concurrent;

namespace E_Commerce.Server.Shared.Caching.Memory;

public sealed class InMemoryRedisPrimitiveService : IRedisPrimitiveService
{
    private readonly ConcurrentDictionary<string, CacheValue> _values = new();
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _sets = new();

    public Task<long> IncrementAsync(
        string key,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        var updated = _values.AddOrUpdate(
            key,
            addValueFactory: _ => new CacheValue(1L, GetExpiresAt(expiration)),
            updateValueFactory: (_, current) =>
            {
                var currentNumber = current.Value is long n && !IsExpired(current) ? n : 0L;
                return new CacheValue(currentNumber + 1, GetExpiresAt(expiration));
            });

        return Task.FromResult((long)updated.Value);
    }

    public Task SetStringAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        _values[key] = new CacheValue(value, GetExpiresAt(expiration));
        return Task.CompletedTask;
    }

    public Task<string?> GetStringAsync(string key, CancellationToken cancellationToken = default)
    {
        if (!_values.TryGetValue(key, out var value) || IsExpired(value))
            return Task.FromResult<string?>(null);

        return Task.FromResult<string?>(value.Value.ToString());
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        _values.TryRemove(key, out _);
        _sets.TryRemove(key, out _);

        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        var existsAsValue = _values.TryGetValue(key, out var value) && !IsExpired(value);
        var existsAsSet = _sets.ContainsKey(key);

        return Task.FromResult(existsAsValue || existsAsSet);
    }

    public Task AddToSetAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        _sets.GetOrAdd(key, _ => new ConcurrentDictionary<string, byte>())
            .TryAdd(value, 0);

        return Task.CompletedTask;
    }

    public Task RemoveFromSetAsync(
        string key,
        string value,
        CancellationToken cancellationToken = default)
    {
        if (_sets.TryGetValue(key, out var set))
            set.TryRemove(value, out _);

        return Task.CompletedTask;
    }

    public Task<IReadOnlyCollection<string>> GetSetMembersAsync(
        string key,
        CancellationToken cancellationToken = default)
    {
        if (!_sets.TryGetValue(key, out var set))
            return Task.FromResult<IReadOnlyCollection<string>>(Array.Empty<string>());

        return Task.FromResult<IReadOnlyCollection<string>>(set.Keys.ToArray());
    }

    public Task<long> DecrementAsync(string key, CancellationToken cancellationToken = default)
    {
        var next = 0L;

        if (_values.TryGetValue(key, out var current) &&
            current.Value is long currentNumber &&
            !IsExpired(current))
        {
            next = Math.Max(0L, currentNumber - 1);
        }

        _values[key] = new CacheValue(next, null);
        return Task.FromResult(next);
    }

    public Task SetExpirationAsync(
        string key,
        TimeSpan expiration,
        CancellationToken cancellationToken = default)
    {
        if (_values.TryGetValue(key, out var value))
            _values[key] = value.WithExpiration(DateTime.UtcNow.Add(expiration));

        return Task.CompletedTask;
    }

    private static DateTime? GetExpiresAt(TimeSpan? expiration)
        => expiration is null ? null : DateTime.UtcNow.Add(expiration.Value);

    private static bool IsExpired(CacheValue value)
        => value.ExpiresAt is not null && value.ExpiresAt <= DateTime.UtcNow;
}
