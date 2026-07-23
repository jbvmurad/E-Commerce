using AutoMapper;
using AutoMapper.QueryableExtensions;
using E_Commerce.Server.Shared.Authorization.Permissions;
using E_Commerce.Server.Shared.Authorization.Policies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.DeleteUserRole;
using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;
using Security.Domain.DTOs.UserDTOs;
using Security.Presentation.Controllers.AbstractController;
using Wolverine;

namespace Security.Presentation.Controllers.UserControllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UserRoleController : APIController
{
    private readonly IUserRoleService _userRoleService;
    private readonly IMapper _mapper;

    public UserRoleController(
        IMessageBus bus,
        IUserRoleService userRoleService,
        IMapper mapper) : base(bus)
    {
        _userRoleService = userRoleService;
        _mapper = mapper;
    }

    [HasPermission(ApplicationPermissions.RoleAssignments.Read)]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        ODataQueryOptions<UserRoleQueryModel> options,
        CancellationToken cancellationToken)
    {
        IQueryable<UserRoleQueryModel> query = _userRoleService.GetAllUserRoles();

        query = (IQueryable<UserRoleQueryModel>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<UserRoleResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HasPermission(ApplicationPermissions.RoleAssignments.Manage)]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteRoles([FromRoute] string userId, [FromBody] DeleteUserRoleBody body)
    {
        var command = new DeleteUserRoleFullCommand(userId, body.RoleIds.Select(x => x.ToString()).ToList());
        MessageResponse result = await _bus.InvokeAsync<MessageResponse>(command);
        return Ok(result);
    }

    [HasPermission(ApplicationPermissions.RoleAssignments.Manage)]
    [HttpPost]
    public async Task<IActionResult> Create(GiveUserRoleCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request);
        return Ok(response);
    }
}
