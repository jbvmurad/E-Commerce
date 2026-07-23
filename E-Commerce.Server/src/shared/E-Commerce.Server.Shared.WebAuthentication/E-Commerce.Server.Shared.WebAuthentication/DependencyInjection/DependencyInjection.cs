using E_Commerce.Server.Shared.ExternalAuthentication.Abstractions;
using E_Commerce.Server.Shared.ExternalAuthentication.Providers.Google;
using E_Commerce.Server.Shared.ExternalAuthentication.Resolvers;
using E_Commerce.Server.Shared.ExternalAuthentication.Validation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.ExternalAuthentication.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddSharedExternalAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        services.TryAddEnumerable(
            ServiceDescriptor.Singleton<
                IValidateOptions<GoogleAuthOptions>,
                GoogleAuthOptionsValidator>());

        services
            .AddOptions<GoogleAuthOptions>()
            .Bind(configuration.GetSection(GoogleAuthOptions.SectionName))
            .ValidateOnStart();

        services.TryAddEnumerable(
            ServiceDescriptor.Scoped<
                IExternalAuthProvider,
                GoogleExternalAuthProvider>());

        services.TryAddScoped<
            IExternalAuthProviderResolver,
            ExternalAuthProviderResolver>();

        return services;
    }
}
