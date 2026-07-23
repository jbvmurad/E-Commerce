using E_Commerce.Server.Shared.Caching.Abstraction;

namespace E_Commerce.Server.Shared.Caching.Redis;

public sealed class RedisJwtBlacklistService : IJwtBlacklistService
{
    private readonly IRedisPrimitiveService _redis;
    public RedisJwtBlacklistService(IRedisPrimitiveService redis)
    {
        _redis = redis;
    }
    public Task BlacklistAsync(string jti, TimeSpan remaining, CancellationToken cancellationToken = default)
        => _redis.SetStringAsync(BlacklistKey(jti), "revoked", remaining, cancellationToken);

    public Task<bool> IsBlacklistedAsync(string jti, CancellationToken cancellationToken = default)
        => _redis.ExistsAsync(BlacklistKey(jti), cancellationToken);

    private static string BlacklistKey(string jti) => $"auth:blacklist:jti:{jti}";
}
