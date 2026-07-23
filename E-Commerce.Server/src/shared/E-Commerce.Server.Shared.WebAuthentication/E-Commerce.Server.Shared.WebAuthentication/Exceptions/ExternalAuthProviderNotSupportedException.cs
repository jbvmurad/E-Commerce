namespace E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;

public sealed class ExternalAuthProviderNotSupportedException : Exception
{
    public ExternalAuthProviderNotSupportedException(
        string providerName,
        IReadOnlyCollection<string> supportedProviders)
        : base(CreateMessage(providerName, supportedProviders))
    {
        ProviderName = providerName;
        SupportedProviders = supportedProviders;
    }

    public string ProviderName { get; }

    public IReadOnlyCollection<string> SupportedProviders { get; }

    private static string CreateMessage(
        string providerName,
        IReadOnlyCollection<string> supportedProviders)
    {
        var supported = supportedProviders.Count == 0
            ? "none"
            : string.Join(", ", supportedProviders);

        return $"External authentication provider '{providerName}' is not supported. Supported providers: {supported}.";
    }
}
