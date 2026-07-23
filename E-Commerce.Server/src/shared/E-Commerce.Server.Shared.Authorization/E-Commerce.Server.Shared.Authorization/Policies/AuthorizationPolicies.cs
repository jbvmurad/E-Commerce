namespace E_Commerce.Server.Shared.Authorization.Policies;

public static class AuthorizationPolicies
{
    public const string DashboardAccess = "dashboard.access";
    public const string PermissionPrefix = "permission:";

    public static string Permission(string permission)
        => PermissionPrefix + permission;
}
