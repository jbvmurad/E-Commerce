using E_Commerce.Server.Shared.Caching.Extensions;
using E_Commerce.Server.Shared.Localization.DependencyInjection;
using E_Commerce.Server.Shared.Middleware.Middleware;
using E_Commerce.Server.Shared.Storage.DependencyInjection;
using Profile.API.Configurations.Abstraction;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class InfrastructureServiceInstallers : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceLocalization();
        services.AddSharedCaching(configuration);
        services.AddScoped<ExceptionMiddleware>();
        services.AddSharedStorage(configuration);
    }
}
