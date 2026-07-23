using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.DeleteUserRole;
using Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;
using Security.Domain.DTOs.UserDTOs;

namespace Security.Application.Services.UserAttributeService;

public interface IUserRoleService
{
    Task GiveAsync(GiveUserRoleCommand request, CancellationToken cancellationToken);
    Task DeleteAsync(DeleteUserRoleFullCommand request, CancellationToken cancellationToken);
    IQueryable<UserRoleQueryModel> GetAllUserRoles();
}
