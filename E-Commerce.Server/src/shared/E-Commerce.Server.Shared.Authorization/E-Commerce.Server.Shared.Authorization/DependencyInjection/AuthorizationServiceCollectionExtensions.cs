using E_Commerce.Server.Shared.Authorization.Policies;
using E_Commerce.Server.Shared.Authorization.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace E_Commerce.Server.Shared.Authorization.DependencyInjection;

public static class AuthorizationServiceCollectionExtensions
{
    public static IServiceCollection AddECommerceAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(AuthorizationPolicies.DashboardAccess, policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireRole(ApplicationRoles.DashboardRoles.ToArray());
            });
        });

        services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        return services;
    }
}
