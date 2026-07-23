using AI.API.Configurations.Abstraction;
using E_Commerce.Server.Shared.Authentication.Jwt;
using E_Commerce.Server.Shared.Authorization.DependencyInjection;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class AuthorizeServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceAuthentication(configuration);
        services.AddECommerceAuthorization();
    }
}
