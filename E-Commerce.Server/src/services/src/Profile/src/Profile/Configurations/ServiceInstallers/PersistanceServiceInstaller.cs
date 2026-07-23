using GenericRepository;
using Microsoft.EntityFrameworkCore;
using Profile.API.Configurations.Abstraction;
using Profile.Persistance.Context;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class PersistanceServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddAutoMapper(cfg =>
        {
            cfg.AddMaps(typeof(Profile.Persistance.AssemblyReference).Assembly);
        });

        var connectionString = configuration.GetConnectionString("ProfileConnection");
        services.AddDbContext<ProfileContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddScoped<IUnitOfWork>(srv => srv.GetRequiredService<ProfileContext>());
    }
}
