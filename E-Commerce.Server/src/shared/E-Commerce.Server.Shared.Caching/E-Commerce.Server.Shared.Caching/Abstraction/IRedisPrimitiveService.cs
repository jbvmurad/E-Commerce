namespace E_Commerce.Server.Shared.Caching.Abstraction;

public interface IRedisPrimitiveService
{
    Task<long> IncrementAsync(
        string key,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default);

    Task SetStringAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default);

    Task<string?> GetStringAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task AddToSetAsync(
        string key,
        string value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default);

    Task RemoveFromSetAsync(
        string key,
        string value,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<string>> GetSetMembersAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task<long> DecrementAsync(
        string key,
        CancellationToken cancellationToken = default);

    Task SetExpirationAsync(
        string key,
        TimeSpan expiration,
        CancellationToken cancellationToken = default);
}
