using ApiGateway.Configurations.Abstraction;
using Microsoft.AspNetCore.Server.Kestrel.Core;

public sealed class GatewayServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        services.Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = null;
        });

        var openApiEnabled = configuration.GetValue<bool>("OpenApi:Enabled");
        if (openApiEnabled)
            services.AddHttpClient("openapi-proxy");
    }
}
