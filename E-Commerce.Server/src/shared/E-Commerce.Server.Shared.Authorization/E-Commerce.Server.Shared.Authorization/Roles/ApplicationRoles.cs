namespace E_Commerce.Server.Shared.Authorization.Roles;

public static class ApplicationRoles
{
    public const string Admin = "Admin";
    public const string Seller = "Seller";

    public static IReadOnlyList<string> SystemRoles { get; } =
        new[]
        {
            Admin,
            Seller
        };

    public static IReadOnlyList<string> DashboardRoles { get; } =
        new[]
        {
            Admin,
            Seller
        };

    public static bool IsSystemRole(string roleName)
        => SystemRoles.Contains(roleName, StringComparer.OrdinalIgnoreCase);
}
