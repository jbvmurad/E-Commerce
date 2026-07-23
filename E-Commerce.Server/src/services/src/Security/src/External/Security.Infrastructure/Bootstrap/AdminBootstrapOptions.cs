namespace Security.Infrastructure.Bootstrap;

public sealed class AdminBootstrapOptions
{
    public const string SectionName = "AdminBootstrap";

    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; } = "System Admin";
}
