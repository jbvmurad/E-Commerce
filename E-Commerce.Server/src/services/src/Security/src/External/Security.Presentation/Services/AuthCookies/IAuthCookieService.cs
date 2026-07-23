using Microsoft.AspNetCore.Http;

namespace Security.Presentation.Services.AuthCookies;

public interface IAuthCookieService
{
    void SetAuthCookies(HttpResponse response, string accessToken, string refreshToken, DateTime? refreshTokenExpires);
    void ClearAuthCookies(HttpResponse response);
    string? GetRefreshToken(HttpRequest request);
}
