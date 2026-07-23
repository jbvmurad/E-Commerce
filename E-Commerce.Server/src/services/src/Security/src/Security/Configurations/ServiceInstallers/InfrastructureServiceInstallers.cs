using E_Commerce.Server.Shared.EmailService.DependencyInjection;
using E_Commerce.Server.Shared.Localization.DependencyInjection;
using E_Commerce.Server.Shared.Middleware.Middleware;
using Security.API.Configurations.Abstraction;
using Security.Application.Jwt;
using Security.Infrastructure.Authentication;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class InfrastructureServiceInstallers : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddECommerceLocalization();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<ExceptionMiddleware>();

        services.AddECommerceEmail(configuration);
    }
}
