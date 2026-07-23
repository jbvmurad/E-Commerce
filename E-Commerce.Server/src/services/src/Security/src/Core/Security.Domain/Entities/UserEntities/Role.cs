using Microsoft.AspNetCore.Identity;

namespace Security.Domain.Entities.UserEntities;

public sealed class Role : IdentityRole<string>
{
    public Role()
    {
        Id= Guid.NewGuid().ToString();
    }
}
