using E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;
using E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;

namespace E_Commerce.Server.Shared.ExternalAuthentication.Resolvers;

internal sealed class ExternalAuthProviderResolver
    : IExternalAuthProviderResolver
{
    private readonly IReadOnlyDictionary<string, IExternalAuthProvider>
        _providers;

    public ExternalAuthProviderResolver(
        IEnumerable<IExternalAuthProvider> providers)
    {
        ArgumentNullException.ThrowIfNull(providers);

        var providerList = providers.ToArray();
        EnsureProviderNamesAreUnique(providerList);

        _providers = providerList.ToDictionary(
            provider => provider.ProviderName,
            StringComparer.OrdinalIgnoreCase);

        SupportedProviders = _providers.Keys
            .OrderBy(provider => provider, StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    public IReadOnlyCollection<string> SupportedProviders { get; }

    public IExternalAuthProvider Resolve(string providerName)
    {
        if (string.IsNullOrWhiteSpace(providerName))
        {
            throw new ArgumentException(
                "External authentication provider is required.",
                nameof(providerName));
        }

        var normalizedProviderName = providerName.Trim();

        if (_providers.TryGetValue(
                normalizedProviderName,
                out var provider))
        {
            return provider;
        }

        throw new ExternalAuthProviderNotSupportedException(
            normalizedProviderName,
            SupportedProviders);
    }

    private static void EnsureProviderNamesAreUnique(
        IReadOnlyCollection<IExternalAuthProvider> providers)
    {
        var duplicateProviderName = providers
            .GroupBy(
                provider => provider.ProviderName,
                StringComparer.OrdinalIgnoreCase)
            .FirstOrDefault(group => group.Count() > 1)
            ?.Key;

        if (!string.IsNullOrWhiteSpace(duplicateProviderName))
        {
            throw new InvalidOperationException(
                $"More than one external authentication provider is registered with the name '{duplicateProviderName}'.");
        }
    }
}
