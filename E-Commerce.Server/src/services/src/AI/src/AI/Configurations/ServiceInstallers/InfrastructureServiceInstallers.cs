using AI.API.Configurations.Abstraction;
using AI.Infrastructure.DependencyInjection;
using E_Commerce.Server.Shared.AI.DependencyInjection;
using E_Commerce.Server.Shared.Caching.Extensions;
using E_Commerce.Server.Shared.Localization.DependencyInjection;
using E_Commerce.Server.Shared.Middleware.Middleware;
using E_Commerce.Server.Shared.Storage.DependencyInjection;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class InfrastructureServiceInstallers : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceLocalization();
        services.AddSharedCaching(configuration);
        services.AddSharedStorage(configuration);
        services.AddSharedAI(configuration);
        services.AddAIInfrastructure();
        services.AddScoped<ExceptionMiddleware>();
    }
}
