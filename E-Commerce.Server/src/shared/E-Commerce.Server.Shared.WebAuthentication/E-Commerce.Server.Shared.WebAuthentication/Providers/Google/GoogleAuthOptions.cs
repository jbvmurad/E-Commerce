namespace E_Commerce.Server.Shared.ExternalAuthentication.Providers.Google;

public sealed class GoogleAuthOptions
{
    public const string SectionName = "ExternalAuthentication:Google";

    public bool Enabled { get; set; }

    public string ClientId { get; set; } = string.Empty;
}
