using Microsoft.AspNetCore.Builder;

namespace E_Commerce.Server.Shared.Authorization.RateLimiting;

public static class AuthRateLimitApplicationBuilderExtensions
{
    public static IApplicationBuilder UseAuthRateLimitRequestIdentity(this IApplicationBuilder app)
        => app.UseMiddleware<AuthRateLimitRequestIdentityMiddleware>();
}
