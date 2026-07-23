namespace E_Commerce.Server.Shared.Caching.Redis;

public sealed class RedisKeyBuilder
{
    private readonly string _instanceName;

    public RedisKeyBuilder(string? instanceName)
    {
        _instanceName = instanceName ?? string.Empty;
    }

    public string Build(string key)
    {
        if (string.IsNullOrWhiteSpace(_instanceName))
            return key;

        if (key.StartsWith(_instanceName, StringComparison.OrdinalIgnoreCase))
            return key;

        return $"{_instanceName}{key}";
    }
}
