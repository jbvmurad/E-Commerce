using FluentValidation;
using JasperFx.CodeGeneration.Model;
using Profile.API.Configurations.Abstraction;
using Wolverine;
using Wolverine.FluentValidation;

namespace Profile.API.Configurations.ServiceInstallers;

public sealed class ApplicationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddWolverine(cfg =>
        {
            cfg.ServiceLocationPolicy = ServiceLocationPolicy.AllowedButWarn;
            cfg.Discovery.IncludeAssembly(typeof(ApplicationServiceInstaller).Assembly);
            cfg.Discovery.IncludeAssembly(typeof(Profile.Application.AssemblyReference).Assembly);
            cfg.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);
            cfg.ConfigureRabbitMqMessaging(configuration);
        });

        services.AddValidatorsFromAssembly(typeof(Profile.Application.AssemblyReference).Assembly);
    }
}
