using AutoMapper;
using AutoMapper.QueryableExtensions;
using E_Commerce.Server.Shared.Authorization.Permissions;
using E_Commerce.Server.Shared.Authorization.Policies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.CreateRole;
using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.DeleteRole;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;
using Security.Presentation.Controllers.AbstractController;
using Wolverine;

namespace Security.Presentation.Controllers.UserControllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RoleController : APIController
{
    private readonly IRoleService _roleService;
    private readonly IMapper _mapper;

    public RoleController(IMessageBus bus, IRoleService roleService, IMapper mapper) : base(bus)
    {
        _roleService = roleService;
        _mapper = mapper;
    }

    [HasPermission(ApplicationPermissions.Roles.Read)]
    [HttpGet]
    public async Task<IActionResult> GetAll(ODataQueryOptions<Role> options, CancellationToken cancellationToken)
    {
        IQueryable<Role> query = _roleService.GetAllRoles();

        query = (IQueryable<Role>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<RoleResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HasPermission(ApplicationPermissions.Roles.Manage)]
    [HttpPost]
    public async Task<IActionResult> Create(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }

    [HasPermission(ApplicationPermissions.Roles.Manage)]
    [HttpDelete]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        DeleteRoleCommand request = new(id.ToString());
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }
}
