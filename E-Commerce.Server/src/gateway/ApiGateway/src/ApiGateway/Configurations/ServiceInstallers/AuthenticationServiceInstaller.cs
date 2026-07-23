using System.Text;
using ApiGateway.Configurations.Abstraction;
using ApiGateway.Configurations.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ApiGateway.Configurations.ServiceInstallers;

public sealed class AuthenticationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        var jwtSecret = configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT secret is not configured");

        var jwtIssuer = configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer is not configured");

        var jwtAudience = configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience is not configured");

        var key = Encoding.UTF8.GetBytes(jwtSecret);

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = GatewayConfigurationHelpers.ExtractToken(context.Request);
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();
    }
}
