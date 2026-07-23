using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ApiGateway.Configurations.Helpers;

namespace ApiGateway.Configurations.Extensions;

public static partial class ApplicationBuilderExtensions
{
    private static IApplicationBuilder UseGatewayAuthentication(this IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path.Value?.ToLowerInvariant() ?? string.Empty;
            var isGatewayProtectedPath = path.StartsWith("/api/") || path.StartsWith("/hubs/notifications") || path.StartsWith("/hubs/chat");

            if (isGatewayProtectedPath)
            {
                var token = GatewayConfigurationHelpers.ExtractToken(context.Request);

                if (!string.IsNullOrWhiteSpace(token) &&
                    !context.Request.Headers.ContainsKey("Authorization"))
                {
                    context.Request.Headers.Authorization = $"Bearer {token}";
                }

                if (!GatewayConfigurationHelpers.IsAnonymousPath(path))
                {
                    var authResult = await context.AuthenticateAsync(JwtBearerDefaults.AuthenticationScheme);
                    if (!authResult.Succeeded || authResult.Principal is null)
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsJsonAsync(new { message = "Unauthorized" });
                        return;
                    }

                    context.User = authResult.Principal;
                }
            }

            await next();
        });

        return app;
    }
}
