using System.Security.Claims;
using E_Commerce.Server.Shared.Authorization.Permissions;
using Microsoft.AspNetCore.Authorization;

namespace E_Commerce.Server.Shared.Authorization.Policies;

public sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var roles = context.User
            .FindAll(ClaimTypes.Role)
            .Select(claim => claim.Value);

        if (roles.Any(role => RolePermissions.RoleHasPermission(role, requirement.Permission)))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
