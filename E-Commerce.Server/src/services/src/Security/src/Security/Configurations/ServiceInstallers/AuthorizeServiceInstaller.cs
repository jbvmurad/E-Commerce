using E_Commerce.Server.Shared.Authentication.Jwt;
using E_Commerce.Server.Shared.Authorization.DependencyInjection;
using E_Commerce.Server.Shared.Authorization.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Security.API.Configurations.Abstraction;
using Security.Domain.Entities.UserEntities;
using Security.Persistance.Context;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class AuthorizeServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceAuthentication(configuration);
        services.AddECommerceAuthorization();
        services.AddECommerceAuthRateLimiting();

        services.AddIdentity<User, Role>()
            .AddEntityFrameworkStores<SecurityContext>()
            .AddDefaultTokenProviders();
    }
}
