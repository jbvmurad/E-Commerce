using ApiGateway.Configurations.Abstraction;

namespace ApiGateway.Configurations.ServiceInstallers;

public sealed class CorsServiceInstaller : IServiceInstaller
{
    public const string PolicyName = "AllowFrontend";

    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        var allowedOrigins = configuration["GATEWAY_ALLOWED_ORIGINS"]
            ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            ?? new[]
            {
                "http://localhost:3000",
                "http://localhost:5173",
                "https://localhost:3000",
                "https://localhost:5173"
            };

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
    }
}
