namespace E_Commerce.Server.Shared.Authentication.Jwt;

public sealed class JwtOptions
{
    public string Audience { get; set; }
    public string SecretKey { get; set; }
    public string Issuer { get; set; }

}
