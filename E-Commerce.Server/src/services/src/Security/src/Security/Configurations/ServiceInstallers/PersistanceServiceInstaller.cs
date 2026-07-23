using GenericRepository;
using Microsoft.EntityFrameworkCore;
using Security.API.Configurations.Abstraction;
using Security.Persistance.Context;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class PersistanceServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddAutoMapper(cfg =>
        {
            cfg.AddMaps(typeof(Security.Persistance.AssemblyReference).Assembly);
        });

        var connectionString = configuration.GetConnectionString("SecurityConnection");
        services.AddDbContext<SecurityContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddScoped<IUnitOfWork>(srv => srv.GetRequiredService<SecurityContext>());
    }
}
