using Microsoft.AspNetCore.Http;

namespace Security.Presentation.Services.AuthCookies;

public sealed class AuthCookieService : IAuthCookieService
{
    private const string AccessTokenCookie = "accessToken";
    private const string RefreshTokenCookie = "refreshToken";

    public void SetAuthCookies(HttpResponse response, string accessToken, string refreshToken, DateTime? refreshTokenExpires)
    {
        var isProduction = IsProductionEnvironment();

        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(30),
            Path = "/"
        };

        var refreshTokenOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isProduction,
            SameSite = SameSiteMode.Lax,
            Expires = refreshTokenExpires.HasValue
                ? new DateTimeOffset(DateTime.SpecifyKind(refreshTokenExpires.Value, DateTimeKind.Utc))
                : DateTimeOffset.UtcNow.AddDays(30),
            Path = "/"
        };

        response.Cookies.Append(AccessTokenCookie, accessToken, accessTokenOptions);
        response.Cookies.Append(RefreshTokenCookie, refreshToken, refreshTokenOptions);
    }

    public void ClearAuthCookies(HttpResponse response)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = IsProductionEnvironment(),
            SameSite = SameSiteMode.Lax,
            Path = "/"
        };

        response.Cookies.Delete(AccessTokenCookie, options);
        response.Cookies.Delete(RefreshTokenCookie, options);
    }

    public string? GetRefreshToken(HttpRequest request)
    {
        return request.Cookies.TryGetValue(RefreshTokenCookie, out string? refreshToken)
            ? refreshToken
            : null;
    }

    private static bool IsProductionEnvironment()
        => Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development";
}
