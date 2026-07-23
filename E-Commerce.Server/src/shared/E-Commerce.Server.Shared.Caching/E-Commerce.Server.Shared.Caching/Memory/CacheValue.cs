namespace E_Commerce.Server.Shared.Caching.Memory;

internal sealed class CacheValue
{
    public CacheValue(object value, DateTime? expiresAt)
    {
        Value = value;
        ExpiresAt=expiresAt;
    }

    public object Value { get; }
    public DateTime? ExpiresAt { get; }

    public CacheValue WithExpiration(DateTime? expiresAt) 
        => new(Value, expiresAt);
}
