using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;
using System.Threading.RateLimiting;

namespace E_Commerce.Server.Shared.Authorization.RateLimiting;

public static class AuthRateLimitServiceCollectionExtensions
{
    public static IServiceCollection AddECommerceAuthRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy(AuthRateLimitPolicies.Login, context =>
                CreateSlidingWindowPartition(BuildIpEmailKey(context, AuthRateLimitPolicies.Login), 5, TimeSpan.FromMinutes(1)));

            options.AddPolicy(AuthRateLimitPolicies.Register, context =>
                CreateFixedWindowPartition(BuildIpEmailKey(context, AuthRateLimitPolicies.Register), 5, TimeSpan.FromMinutes(10)));

            options.AddPolicy(AuthRateLimitPolicies.ForgotPassword, context =>
                CreateFixedWindowPartition(BuildIpEmailKey(context, AuthRateLimitPolicies.ForgotPassword), 3, TimeSpan.FromMinutes(15)));

            options.AddPolicy(AuthRateLimitPolicies.ResendConfirmationEmail, context =>
                CreateFixedWindowPartition(BuildIpEmailKey(context, AuthRateLimitPolicies.ResendConfirmationEmail), 3, TimeSpan.FromMinutes(15)));

            options.AddPolicy(AuthRateLimitPolicies.ResetPassword, context =>
                CreateFixedWindowPartition(BuildIpUserKey(context, AuthRateLimitPolicies.ResetPassword), 5, TimeSpan.FromMinutes(15)));

            options.AddPolicy(AuthRateLimitPolicies.ConfirmEmail, context =>
                CreateFixedWindowPartition(BuildIpKey(context, AuthRateLimitPolicies.ConfirmEmail), 10, TimeSpan.FromMinutes(1)));

            options.AddPolicy(AuthRateLimitPolicies.RefreshToken, context =>
                CreateFixedWindowPartition(BuildIpUserKey(context, AuthRateLimitPolicies.RefreshToken), 20, TimeSpan.FromMinutes(1)));

            options.AddPolicy(AuthRateLimitPolicies.Logout, context =>
                CreateFixedWindowPartition(BuildIpUserKey(context, AuthRateLimitPolicies.Logout), 20, TimeSpan.FromMinutes(1)));

            options.AddPolicy(AuthRateLimitPolicies.ChangeEmail, context =>
                CreateFixedWindowPartition(BuildIpUserKey(context, AuthRateLimitPolicies.ChangeEmail), 5, TimeSpan.FromMinutes(15)));

            options.AddPolicy(AuthRateLimitPolicies.ConfirmEmailChange, context =>
                CreateFixedWindowPartition(BuildIpKey(context, AuthRateLimitPolicies.ConfirmEmailChange), 10, TimeSpan.FromMinutes(15)));

            options.AddPolicy(AuthRateLimitPolicies.ChangePassword, context =>
                CreateFixedWindowPartition(BuildIpUserKey(context, AuthRateLimitPolicies.ChangePassword), 5, TimeSpan.FromMinutes(15)));
        });

        return services;
    }

    private static RateLimitPartition<string> CreateFixedWindowPartition(string partitionKey, int permitLimit, TimeSpan window)
    {
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: partitionKey,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = window,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    }

    private static RateLimitPartition<string> CreateSlidingWindowPartition(string partitionKey, int permitLimit, TimeSpan window)
    {
        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: partitionKey,
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = window,
                SegmentsPerWindow = 2,
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    }

    private static string BuildIpKey(HttpContext context, string policyName)
    {
        string ip = ClientIpAddressResolver.GetClientIp(context);
        return $"{policyName}:{NormalizePartitionValue(ip, "unknown-ip")}";
    }

    private static string BuildIpEmailKey(HttpContext context, string policyName)
    {
        string ip = ClientIpAddressResolver.GetClientIp(context);
        string email = GetItemValue(context, AuthRateLimitHttpContextItems.Email) ?? "anonymous-email";
        return $"{policyName}:{NormalizePartitionValue(ip, "unknown-ip")}:{NormalizePartitionValue(email, "anonymous-email")}";
    }

    private static string BuildIpUserKey(HttpContext context, string policyName)
    {
        string ip = ClientIpAddressResolver.GetClientIp(context);
        string userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? GetItemValue(context, AuthRateLimitHttpContextItems.UserId)
            ?? "anonymous-user";

        return $"{policyName}:{NormalizePartitionValue(ip, "unknown-ip")}:{NormalizePartitionValue(userId, "anonymous-user")}";
    }

    private static string? GetItemValue(HttpContext context, string key)
    {
        return context.Items.TryGetValue(key, out object? value)
            ? value?.ToString()
            : null;
    }

    private static string NormalizePartitionValue(string? value, string fallback)
    {
        if (string.IsNullOrWhiteSpace(value))
            return fallback;

        return value.Trim().ToLowerInvariant();
    }
}
