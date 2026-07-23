using E_Commerce.Server.Shared.Authentication.Jwt;
using E_Commerce.Server.Shared.Authorization.DependencyInjection;
using Profile.API.Configurations.Abstraction;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class AuthorizeServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceAuthentication(configuration);
        services.AddECommerceAuthorization();
    }
}
