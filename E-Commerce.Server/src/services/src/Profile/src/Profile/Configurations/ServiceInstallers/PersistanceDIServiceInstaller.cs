using Profile.API.Configurations.Abstraction;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.Repositories.ProfileAttributeRepositories;
using Profile.Persistance.Repositories.ProfileAttributeRepositories;
using Profile.Persistance.Services.ProfileAttributeServices;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class PersistanceDIServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddHttpContextAccessor();

        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<IUserAddressService, UserAddressService>();
        services.AddScoped<IProfileRepository, ProfileRepository>();
        services.AddScoped<IUserAddressRepository, UserAddressRepository>();
    }
}
