using System.Reflection;
using ApiGateway.Configurations.Abstraction;

namespace ApiGateway.Configurations;

public static class DependencyInjection
{
    public static IServiceCollection InstallServices(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder hostBuilder,
        params Assembly[] assemblies)
    {
        IEnumerable<IServiceInstaller> serviceInstallers = assemblies
            .SelectMany(assembly => assembly.DefinedTypes)
            .Where(IsAssignableToType<IServiceInstaller>)
            .Select(Activator.CreateInstance)
            .Cast<IServiceInstaller>();

        foreach (var serviceInstaller in serviceInstallers)
        {
            serviceInstaller.Install(services, configuration, hostBuilder);
        }

        return services;

        static bool IsAssignableToType<T>(TypeInfo typeInfo)
            => typeof(T).IsAssignableFrom(typeInfo) &&
               !typeInfo.IsInterface &&
               !typeInfo.IsAbstract;
    }
}
