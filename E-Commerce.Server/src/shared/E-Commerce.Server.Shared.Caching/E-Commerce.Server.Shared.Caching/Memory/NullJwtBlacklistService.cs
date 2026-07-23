using E_Commerce.Server.Shared.Caching.Abstraction;

namespace E_Commerce.Server.Shared.Caching.Memory;

public sealed class NullJwtBlacklistService : IJwtBlacklistService
{
    public Task BlacklistAsync(string jti, TimeSpan remaining, CancellationToken cancellationToken = default)
        =>Task.CompletedTask;

    public Task<bool> IsBlacklistedAsync(string jti, CancellationToken cancellationToken = default)
        => Task.FromResult(false);
}
