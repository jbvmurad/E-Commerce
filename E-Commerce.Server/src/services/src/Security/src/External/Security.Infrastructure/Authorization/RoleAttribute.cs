using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Security.Infrastructure.Authorization;

public sealed class RoleAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _role;

    public RoleAttribute(string role)
    {
        _role = role;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var userIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim is null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userHasRole = context.HttpContext.User
            .FindAll(ClaimTypes.Role)
            .Any(c => c.Value.Equals(_role, StringComparison.OrdinalIgnoreCase));

        if (!userHasRole)
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
