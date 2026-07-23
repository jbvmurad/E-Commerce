using ApiGateway.Configurations.Abstraction;
using ApiGateway.Configurations.Helpers;

namespace ApiGateway.Configurations.ServiceInstallers;

public sealed class ReverseProxyServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        var securityServiceUrl = GatewayConfigurationHelpers.EnsureTrailingSlash(
            configuration["SECURITY_SERVICE_URL"]
            ?? throw new InvalidOperationException("SECURITY_SERVICE_URL is not configured"));

        var profileServiceUrl = GatewayConfigurationHelpers.EnsureTrailingSlash(
            configuration["PROFILE_SERVICE_URL"]
            ?? throw new InvalidOperationException("PROFILE_SERVICE_URL is not configured"));

        var aiServiceUrl = GatewayConfigurationHelpers.EnsureTrailingSlash(
            configuration["AI_SERVICE_URL"]
            ?? throw new InvalidOperationException("AI_SERVICE_URL is not configured"));

        services
            .AddReverseProxy()
            .LoadFromMemory(
                GatewayConfigurationHelpers.GetRoutes(),
                GatewayConfigurationHelpers.GetClusters(
                    securityServiceUrl,
                    profileServiceUrl,
                    aiServiceUrl));

        services.AddHealthChecks();
    }
}
