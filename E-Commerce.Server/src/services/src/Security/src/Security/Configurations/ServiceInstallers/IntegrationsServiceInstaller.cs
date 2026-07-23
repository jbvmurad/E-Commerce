using E_Commerce.Server.Shared.Caching.Extensions;
using E_Commerce.Server.Shared.ExternalAuthentication.DependencyInjection;
using E_Commerce.Server.Shared.Storage.DependencyInjection;
using Security.API.Configurations.Abstraction;
using Security.Infrastructure.Options;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class IntegrationsServiceInstaller : IServiceInstaller
{
    public void Install(
        IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder host)
    {
        services.AddOptions();
        services.Configure<RabbitMqOptions>(
            configuration.GetSection("RabbitMq"));

        services.AddSharedCaching(configuration);
        services.AddSharedStorage(configuration);
        services.AddSharedExternalAuthentication(configuration);
    }
}
