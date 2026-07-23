using ApiGateway.Configurations.ServiceInstallers;
using E_Commerce.Server.Shared.Middleware.Middleware;

namespace ApiGateway.Configurations.Extensions;

public static partial class ApplicationBuilderExtensions
{
    private static readonly (string Name, string UrlKey, string GatewayPrefix, string ServicePrefix)[] Services =
    [
        ("Security", "SECURITY_SERVICE_URL", "/api/security/", "/api/"),
        ("Profile",  "PROFILE_SERVICE_URL",  "/api/profile/",  "/api/profile/"),
        ("AI",       "AI_SERVICE_URL",       "/api/ai/",       "/api/ai/")
    ];

    public static WebApplication UseConfiguredGateway(this WebApplication app)
    {
        app.UseSecurityHeaders();
        app.UseSharedHttpMetrics();
        app.UseCors(CorsServiceInstaller.PolicyName);
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseGatewayAuthentication();

        MapGatewayEndpoints(app);
        MapApiDocumentation(app);

        app.MapReverseProxy();
        app.MapPrometheusMetrics();

        return app;
    }
}
