using FluentValidation;
using JasperFx.CodeGeneration.Model;
using Wolverine;
using Wolverine.FluentValidation;
using Security.API.Configurations.Abstraction;

namespace Security.API.Configurations.ServiceInstallers;

public sealed class ApplicationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddWolverine(cfg =>
        {
            cfg.ServiceLocationPolicy = ServiceLocationPolicy.AllowedButWarn;
            cfg.Discovery.IncludeAssembly(typeof(ApplicationServiceInstaller).Assembly);
            cfg.Discovery.IncludeAssembly(typeof(Security.Application.AssemblyReference).Assembly);

            cfg.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);
            cfg.ConfigureRabbitMqMessaging(configuration);
        });

        services.AddValidatorsFromAssembly(typeof(Security.Application.AssemblyReference).Assembly);
    }
}
