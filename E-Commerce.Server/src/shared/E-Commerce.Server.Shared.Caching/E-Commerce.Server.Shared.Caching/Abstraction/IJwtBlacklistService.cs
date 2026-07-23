namespace E_Commerce.Server.Shared.Caching.Abstraction;

public interface IJwtBlacklistService
{
    Task BlacklistAsync(string jti, TimeSpan remaining, CancellationToken cancellationToken = default);
    Task <bool> IsBlacklistedAsync(string jti, CancellationToken cancellationToken = default);
}
