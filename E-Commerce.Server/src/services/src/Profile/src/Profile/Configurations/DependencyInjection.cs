using Profile.API.Configurations.Abstraction;
using System.Reflection;

namespace Profile.API.Configurations;

public static class DependencyInjection
{
    public static IServiceCollection InstallServices(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder hostBuilder,
        params Assembly[] assemblies)
    {
        IEnumerable<IServiceInstaller> serviceInstallers = assemblies
            .SelectMany(s => s.DefinedTypes)
            .Where(typeInfo => typeof(IServiceInstaller).IsAssignableFrom(typeInfo) &&
                               !typeInfo.IsInterface &&
                               !typeInfo.IsAbstract)
            .Select(Activator.CreateInstance)
            .Cast<IServiceInstaller>();

        foreach (var serviceInstaller in serviceInstallers)
        {
            serviceInstaller.Install(services, configuration, hostBuilder);
        }

        return services;
    }
}
