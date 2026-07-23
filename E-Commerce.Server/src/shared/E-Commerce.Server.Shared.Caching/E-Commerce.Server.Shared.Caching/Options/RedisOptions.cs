namespace E_Commerce.Server.Shared.Caching.Options;

public sealed class RedisOptions
{
    public const string SectionName = "Redis";
    public bool Enabled { get; set; } = true;
    public string? ConnectionString { get; set; }
    public string InstanceName { get; set; } = string.Empty;
    public int DefaultExpirationMinutes { get; set; } = 30;
}
