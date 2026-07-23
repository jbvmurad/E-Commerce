using AI.API.Configurations.Abstraction;
using AI.Persistance.Context;
using GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class PersistanceServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddAutoMapper(configurationExpression =>
        {
            configurationExpression.AddMaps(typeof(AI.Persistance.AssemblyReference).Assembly);
        });

        var connectionString = configuration.GetConnectionString("AIConnection");
        services.AddDbContext<AIContext>(options => options.UseNpgsql(connectionString));
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<AIContext>());
    }
}
