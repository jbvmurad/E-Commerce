using AI.API.Configurations.Abstraction;
using FluentValidation;
using JasperFx.CodeGeneration.Model;
using Wolverine;
using Wolverine.FluentValidation;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class ApplicationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.AddWolverine(options =>
        {
            options.ServiceLocationPolicy = ServiceLocationPolicy.AllowedButWarn;
            options.Discovery.IncludeAssembly(typeof(ApplicationServiceInstaller).Assembly);
            options.Discovery.IncludeAssembly(typeof(AI.Application.AssemblyReference).Assembly);
            options.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);
            options.ConfigureRabbitMqMessaging(configuration);
        });

        services.AddValidatorsFromAssembly(typeof(AI.Application.AssemblyReference).Assembly);
    }
}
