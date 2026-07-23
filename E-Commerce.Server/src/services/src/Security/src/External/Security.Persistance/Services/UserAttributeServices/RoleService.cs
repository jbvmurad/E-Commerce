using AutoMapper;
using E_Commerce.Server.Shared.Authorization.Roles;
using E_Commerce.Server.Shared.Localization.Localizations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.CreateRole;
using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.DeleteRole;
using Security.Application.Services.UserAttributeService;
using Security.Domain.Entities.UserEntities;

namespace Security.Persistance.Services.UserAttributeServices;

public sealed class RoleService : IRoleService
{
    private readonly RoleManager<Role> _roleManager;
    private readonly IMapper _mapper;
    private readonly ILocalizationService _lan;

    public RoleService(RoleManager<Role> roleManager, IMapper mapper, ILocalizationService lan)
    {
        _roleManager = roleManager;
        _mapper = mapper;
        _lan = lan;
    }

    public async Task CreateAsync(CreateRoleCommand request)
    {
        Role role = new()
        {
            Name = request.Name,
        };
        IdentityResult result = await _roleManager.CreateAsync(role);
        if (!result.Succeeded)
            throw new InvalidOperationException(_lan.Get("Error.Unknown"));
    }

    public async Task DeleteAsync(DeleteRoleCommand request)
    {
        var role = await _roleManager.FindByIdAsync(request.Id.ToString());

        if (role is null)
            throw new ArgumentException(_lan.Get("Error.RoleNotFound"));

        if (ApplicationRoles.IsSystemRole(role.Name))
            throw new InvalidOperationException(_lan.Get("Error.SystemRoleProtected"));

        IdentityResult result = await _roleManager.DeleteAsync(role);
        if (!result.Succeeded)
            throw new InvalidOperationException(_lan.Get("Error.Unknown"));
    }

    public IQueryable<Role> GetAllRoles()
    => _roleManager.Roles.AsNoTracking();
}
