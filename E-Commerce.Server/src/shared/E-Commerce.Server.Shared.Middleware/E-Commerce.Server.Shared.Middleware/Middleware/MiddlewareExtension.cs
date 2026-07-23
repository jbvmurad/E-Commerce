using Microsoft.AspNetCore.Builder;
using Prometheus;

namespace E_Commerce.Server.Shared.Middleware.Middleware;

public static class MiddlewareExtension
{
    public static IApplicationBuilder UseSharedExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }

    public static IApplicationBuilder UseSharedHttpMetrics(this IApplicationBuilder app)
    {
        app.UseHttpMetrics();
        return app;
    }

    public static WebApplication MapPrometheusMetrics(this WebApplication app)
    {
        app.MapMetrics("/metrics");
        return app;
    }
}
