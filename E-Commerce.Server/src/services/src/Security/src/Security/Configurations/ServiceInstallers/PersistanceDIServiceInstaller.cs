using Security.API.Configurations.Abstraction;
using Security.Application.Services.UserAttributeService;
using Security.Domain.Repositories.UserRepositories;
using Security.Persistance.Repositories.UserAttributeRepositories;
using Security.Persistance.Services.UserAttributeServices;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class PersistanceDIServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddHttpContextAccessor();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserRoleService, UserRoleService>();
        services.AddScoped<IAuthRepository, AuthRepository>();
    }
}
