using E_Commerce.Server.Shared.Authorization.Roles;
using Microsoft.AspNetCore.Identity;
using Security.Domain.Entities.UserEntities;

namespace Security.Infrastructure.Bootstrap;

public sealed class AdminBootstrapService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly AdminBootstrapOptions _options;

    public AdminBootstrapService(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        AdminBootstrapOptions options)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _options = options;
    }

    public async Task EnsureAdminAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.Email) || string.IsNullOrWhiteSpace(_options.Password))
            return;

        foreach (var roleName in ApplicationRoles.SystemRoles)
        {
            await EnsureRoleAsync(roleName);
        }

        User existingAdminUser = await ResolveAdminUserAsync(cancellationToken);
        User adminUser = existingAdminUser ?? new User();

        adminUser.Email = _options.Email;
        adminUser.UserName = _options.Email;
        adminUser.FullName = string.IsNullOrWhiteSpace(_options.FullName)
            ? "System Admin"
            : _options.FullName;
        adminUser.EmailConfirmed = true;

        if (existingAdminUser is null)
        {
            await EnsureSucceededAsync(
                await _userManager.CreateAsync(adminUser, _options.Password),
                "Admin user could not be created.");
        }
        else
        {
            await EnsureSucceededAsync(
                await _userManager.UpdateAsync(adminUser),
                "Admin user could not be updated.");

            await SyncPasswordAsync(adminUser);
        }

        await EnsureAdminRoleOwnershipAsync(adminUser);
    }

    private async Task<User> ResolveAdminUserAsync(CancellationToken cancellationToken)
    {
        User existingByEmail = await _userManager.FindByEmailAsync(_options.Email);
        if (existingByEmail is not null)
            return existingByEmail;

        var adminUsers = await _userManager.GetUsersInRoleAsync(ApplicationRoles.Admin);
        return adminUsers.FirstOrDefault();
    }

    private async Task EnsureRoleAsync(string roleName)
    {
        if (await _roleManager.RoleExistsAsync(roleName))
            return;

        await EnsureSucceededAsync(
            await _roleManager.CreateAsync(new Role { Name = roleName }),
            $"Role '{roleName}' could not be created.");
    }

    private async Task SyncPasswordAsync(User adminUser)
    {
        if (!await _userManager.HasPasswordAsync(adminUser))
        {
            await EnsureSucceededAsync(
                await _userManager.AddPasswordAsync(adminUser, _options.Password),
                "Admin password could not be created.");
            return;
        }

        if (await _userManager.CheckPasswordAsync(adminUser, _options.Password))
            return;

        string resetToken = await _userManager.GeneratePasswordResetTokenAsync(adminUser);
        await EnsureSucceededAsync(
            await _userManager.ResetPasswordAsync(adminUser, resetToken, _options.Password),
            "Admin password could not be synchronized.");
    }

    private async Task EnsureAdminRoleOwnershipAsync(User adminUser)
    {
        var adminUsers = await _userManager.GetUsersInRoleAsync(ApplicationRoles.Admin);

        foreach (var existingAdmin in adminUsers.Where(user => user.Id != adminUser.Id))
        {
            await EnsureSucceededAsync(
                await _userManager.RemoveFromRoleAsync(existingAdmin, ApplicationRoles.Admin),
                $"Admin role could not be removed from '{existingAdmin.Email}'.");
        }

        if (await _userManager.IsInRoleAsync(adminUser, ApplicationRoles.Admin))
            return;

        await EnsureSucceededAsync(
            await _userManager.AddToRoleAsync(adminUser, ApplicationRoles.Admin),
            "Admin role could not be assigned.");
    }

    private static Task EnsureSucceededAsync(IdentityResult result, string message)
    {
        if (result.Succeeded)
            return Task.CompletedTask;

        throw new InvalidOperationException($"{message} {string.Join(" | ", result.Errors.Select(error => error.Description))}");
    }
}
