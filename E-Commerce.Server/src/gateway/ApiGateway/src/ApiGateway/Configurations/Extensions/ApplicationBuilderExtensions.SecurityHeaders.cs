namespace ApiGateway.Configurations.Extensions;

public static partial class ApplicationBuilderExtensions
{
    private static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path.Value?.ToLowerInvariant() ?? string.Empty;
            var isScalarPath = path.StartsWith("/scalar") || path.StartsWith("/openapi");

            if (isScalarPath)
            {
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            }
            else
            {
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-Frame-Options", "DENY");
                context.Response.Headers.Append("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
                context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
                context.Response.Headers.Append("X-Permitted-Cross-Domain-Policies", "none");
                context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

                if (context.Request.IsHttps)
                    context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }

            await next();
        });

        return app;
    }
}
