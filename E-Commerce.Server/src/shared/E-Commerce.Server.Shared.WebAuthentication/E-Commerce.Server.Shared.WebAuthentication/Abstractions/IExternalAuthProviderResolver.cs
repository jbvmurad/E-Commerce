namespace E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;

public interface IExternalAuthProviderResolver
{
    IReadOnlyCollection<string> SupportedProviders { get; }

    IExternalAuthProvider Resolve(string providerName);
}
