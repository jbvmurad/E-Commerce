namespace Security.Infrastructure.Options;

public sealed class RabbitMqOptions
{
    public bool Enabled { get; set; } = true;
    public string? ConnectionString { get; set; }
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 5672;
    public string VirtualHost { get; set; } = "/";
    public string Username { get; set; } = "security";
    public string Password { get; set; } = "security";
}
