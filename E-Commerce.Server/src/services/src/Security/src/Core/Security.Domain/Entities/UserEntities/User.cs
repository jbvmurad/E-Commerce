using Microsoft.AspNetCore.Identity;

namespace Security.Domain.Entities.UserEntities;

public sealed class User :IdentityUser<string>
{
    public User()
    {
        Id = Guid.NewGuid().ToString();
    }
    public string FullName { get; set; }
    public string? ImageUrl { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpires { get; set; }
}
