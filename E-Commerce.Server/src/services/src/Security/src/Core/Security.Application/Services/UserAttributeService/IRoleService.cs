using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.CreateRole;
using Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.DeleteRole;
using Security.Domain.Entities.UserEntities;

namespace Security.Application.Services.UserAttributeService;

public interface IRoleService
{
    IQueryable<Role> GetAllRoles();
    Task CreateAsync(CreateRoleCommand request);
    Task DeleteAsync(DeleteRoleCommand request);
}
