using System.Security.Claims;
using System.Threading.RateLimiting;
using AI.API.Configurations.Abstraction;
using E_Commerce.Server.Shared.Authorization.RateLimiting;

namespace AI.API.Configurations.ServiceInstallers;

public sealed class AIRateLimitServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration, IHostBuilder host)
    {
        var customerLimit = configuration.GetValue("AI:RateLimits:CustomerRequestsPerMinute", 20);
        var sellerLimit = configuration.GetValue("AI:RateLimits:SellerRequestsPerMinute", 30);

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy("ai-customer-chat", context =>
                CreatePartition(
                    $"customer:{ClientIpAddressResolver.GetClientIp(context)}",
                    customerLimit));

            options.AddPolicy("ai-seller-chat", context =>
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? ClientIpAddressResolver.GetClientIp(context);

                return CreatePartition($"seller:{userId}", sellerLimit);
            });
        });
    }

    private static RateLimitPartition<string> CreatePartition(string key, int permitLimit)
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            key,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = Math.Max(1, permitLimit),
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    }
}
