namespace ApiGateway.Configurations.Helpers;

internal static partial class GatewayConfigurationHelpers
{
    private static readonly string[] AnonymousPrefixes =
    {
        "/api/security/auth/login",
        "/api/security/auth/external-login",
        "/api/security/auth/register",
        "/api/security/auth/confirm-email",
        "/api/security/auth/resend-confirmation",
        "/api/security/auth/forgot-password",
        "/api/security/auth/reset-password",
        "/api/security/auth/createtoken",
        "/api/security/auth/confirm-email-change",
        "/api/ai/customer/chat",
        "/health"
    };

    public static string? ExtractToken(HttpRequest request)
    {
        var authorization = request.Headers.Authorization.ToString();
        if (!string.IsNullOrWhiteSpace(authorization) &&
            authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return authorization["Bearer ".Length..].Trim();
        }

        if (request.Cookies.TryGetValue("accessToken", out var cookieToken) &&
            !string.IsNullOrWhiteSpace(cookieToken))
        {
            return cookieToken;
        }

        return null;
    }

    public static bool IsAnonymousPath(string path)
        => AnonymousPrefixes.Any(path.StartsWith);

    public static string EnsureTrailingSlash(string url)
        => url.EndsWith('/') ? url : url + '/';
}
