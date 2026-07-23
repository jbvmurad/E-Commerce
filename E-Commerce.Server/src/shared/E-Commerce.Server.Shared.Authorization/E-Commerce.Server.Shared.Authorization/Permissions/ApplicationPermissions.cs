namespace E_Commerce.Server.Shared.Authorization.Permissions;

public static class ApplicationPermissions
{
    public static class Dashboard
    {
        public const string Access = "dashboard.access";
    }

    public static class Users
    {
        public const string Read = "users.read";
        public const string Delete = "users.delete";
    }

    public static class Roles
    {
        public const string Read = "roles.read";
        public const string Manage = "roles.manage";
    }

    public static class RoleAssignments
    {
        public const string Read = "role-assignments.read";
        public const string Manage = "role-assignments.manage";
    }

    public static class Categories
    {
        public const string Manage = "categories.manage";
    }


    public static class Seller
    {
        public const string Create = "sellers.create";
        public const string Update = "sellers.update";
    }

    public static class DefaultSkills
    {
        public const string Manage = "default-skills.manage";
    }

    public static IReadOnlyList<string> All { get; } =
        new[]
        {
            Dashboard.Access,
            Users.Read,
            Users.Delete,
            Roles.Read,
            Roles.Manage,
            RoleAssignments.Read,
            RoleAssignments.Manage,
            Categories.Manage,
            Seller.Create,
            Seller.Update,
            DefaultSkills.Manage
        };
}
