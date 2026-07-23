using E_Commerce.Server.Shared.Caching.Abstraction;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace E_Commerce.Server.Shared.Authentication.Jwt;

public static class JwtAuthenticationExtensions
{
    public static IServiceCollection AddECommerceAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.ConfigureOptions<JwtOptionsSetup>();
        services.ConfigureOptions<JwtBearerOptionsSetups>();

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var blacklist = context.HttpContext.RequestServices
                            .GetService<IJwtBlacklistService>();

                        if (blacklist is null)
                            return;

                        var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                        if (string.IsNullOrWhiteSpace(jti))
                            return;

                        if (await blacklist.IsBlacklistedAsync(jti, context.HttpContext.RequestAborted))
                        {
                            context.Fail("Token has been revoked.");
                            return;
                        }

                        var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                        if (string.IsNullOrWhiteSpace(userId))
                            return;

                        var redis = context.HttpContext.RequestServices.GetService<IRedisPrimitiveService>();
                        if (redis is null)
                            return;

                        var passwordChangedAt = await redis.GetStringAsync(
                            $"security:password-changed-at:{userId}",
                            context.HttpContext.RequestAborted);

                        if (string.IsNullOrWhiteSpace(passwordChangedAt))
                            return;

                        if (!DateTime.TryParse(passwordChangedAt, null, DateTimeStyles.RoundtripKind, out var changedAt))
                            return;

                        var iatClaim = context.Principal?.FindFirst(JwtRegisteredClaimNames.Iat)?.Value;
                        if (!long.TryParse(iatClaim, out var iatSeconds))
                            return;

                        var tokenIssuedAt = DateTimeOffset.FromUnixTimeSeconds(iatSeconds).UtcDateTime;
                        if (tokenIssuedAt < changedAt)
                            context.Fail("Password has been changed. Please login again.");
                    }
                };
            });
        services.AddAuthentication();
        return services;
    }
}
