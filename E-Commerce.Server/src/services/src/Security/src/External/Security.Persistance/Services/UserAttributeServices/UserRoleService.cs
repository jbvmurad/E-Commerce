using E_Commerce.Server.Shared.Authorization.Roles;
using E_Commerce.Server.Shared.Localization.Localizations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.DeleteUserRole;
using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;
using Security.Persistance.Context;

namespace Security.Persistance.Services.UserAttributeServices;

public sealed class UserRoleService : IUserRoleService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly SecurityContext _context;
    private readonly ILocalizationService _lan;

    public UserRoleService(
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        SecurityContext context,
        ILocalizationService lan)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
        _lan = lan;
    }

    public async Task GiveAsync(GiveUserRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _roleManager.FindByIdAsync(request.RoleId.ToString());
        if (role is null)
            throw new ArgumentException(_lan.Get("Error.RoleNotFound"));

        if (string.Equals(role.Name, ApplicationRoles.Admin, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException(_lan.Get("Error.AdminRoleProtected"));

        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
            throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        var result = await _userManager.AddToRoleAsync(user, role.Name!);
        if (!result.Succeeded)
            throw new InvalidOperationException(_lan.Get("Error.RoleAlreadyAssigned"));
    }

    public async Task DeleteAsync(DeleteUserRoleFullCommand request, CancellationToken cancellationToken)
    {
        var roles = await _roleManager.Roles
            .Where(r => request.RoleIds.Contains(r.Id))
            .ToListAsync(cancellationToken);

        if (roles.Count == 0)
            throw new InvalidOperationException(_lan.Get("Error.NoMatchingRoles"));

        if (roles.Any(r => string.Equals(r.Name, ApplicationRoles.Admin, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException(_lan.Get("Error.AdminRoleProtected"));

        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
            throw new ArgumentException(_lan.Get("Error.UserNotFound"));

        var result = await _userManager.RemoveFromRolesAsync(user, roles.Select(r => r.Name!));
        if (!result.Succeeded)
            throw new InvalidOperationException(_lan.Get("Error.Unknown"));
    }

    public IQueryable<UserRoleQueryModel> GetAllUserRoles()
    {
        return _context.UserRoles
            .AsNoTracking()
            .Join(
                _context.Users,
                userRole => userRole.UserId,
                user => user.Id,
                (userRole, user) => new { userRole, user })
            .Join(
                _context.Roles,
                value => value.userRole.RoleId,
                role => role.Id,
                (value, role) => new UserRoleQueryModel
                {
                    UserId = value.user.Id,
                    UserFullName = value.user.FullName,
                    UserEmail = value.user.Email,
                    RoleId = role.Id,
                    RoleName = role.Name
                });
    }
}
