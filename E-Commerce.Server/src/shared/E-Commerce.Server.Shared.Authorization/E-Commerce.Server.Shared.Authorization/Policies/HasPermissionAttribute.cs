using Microsoft.AspNetCore.Authorization;

namespace E_Commerce.Server.Shared.Authorization.Policies;

public sealed class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission)
    {
        Policy = AuthorizationPolicies.Permission(permission);
    }
}
