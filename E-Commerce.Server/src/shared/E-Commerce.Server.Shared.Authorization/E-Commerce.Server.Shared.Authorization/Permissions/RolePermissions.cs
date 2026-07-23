using E_Commerce.Server.Shared.Authorization.Roles;

namespace E_Commerce.Server.Shared.Authorization.Permissions;

public static class RolePermissions
{
    private static readonly IReadOnlyDictionary<string, HashSet<string>> PermissionsByRole =
        new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase)
        {
            [ApplicationRoles.Admin] = ToSet(ApplicationPermissions.All),
            [ApplicationRoles.Seller] = ToSet(
                ApplicationPermissions.Dashboard.Access,
                ApplicationPermissions.Seller.Create,
                ApplicationPermissions.Seller.Update)
        };

    public static bool RoleHasPermission(string role, string permission)
        => PermissionsByRole.TryGetValue(role, out var permissions) &&
           permissions.Contains(permission);

    public static IReadOnlyCollection<string> GetPermissions(string role)
        => PermissionsByRole.TryGetValue(role, out var permissions)
            ? permissions
            : Array.Empty<string>();

    private static HashSet<string> ToSet(params IEnumerable<string>[] permissionGroups)
        => permissionGroups
            .SelectMany(group => group)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

    private static HashSet<string> ToSet(params string[] permissions)
        => permissions.ToHashSet(StringComparer.OrdinalIgnoreCase);
}
