using Microsoft.Extensions.Options;
using Security.API.Configurations.Abstraction;
using Security.Infrastructure.Bootstrap;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class AdminBootstrapServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.Configure<AdminBootstrapOptions>(configuration.GetSection(AdminBootstrapOptions.SectionName));
        services.AddScoped(provider => provider.GetRequiredService<IOptions<AdminBootstrapOptions>>().Value);
        services.AddScoped<AdminBootstrapService>();
        services.AddHostedService<AdminBootstrapHostedService>();
    }
}
