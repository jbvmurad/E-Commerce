using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace E_Commerce.Server.Shared.Authorization.RateLimiting;

public static class ClientIpAddressResolver
{
    public static string GetClientIp(HttpContext context)
    {
        string? forwardedFor = GetHeaderValue(context, "X-Forwarded-For");
        if (!string.IsNullOrWhiteSpace(forwardedFor))
        {
            string firstIp = forwardedFor.Split(',')[0].Trim();
            if (!string.IsNullOrWhiteSpace(firstIp))
                return firstIp;
        }

        string? realIp = GetHeaderValue(context, "X-Real-IP");
        if (!string.IsNullOrWhiteSpace(realIp))
            return realIp.Trim();

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static string? GetHeaderValue(HttpContext context, string name)
    {
        return context.Request.Headers.TryGetValue(name, out StringValues values)
            ? values.FirstOrDefault()
            : null;
    }
}
