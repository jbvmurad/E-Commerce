using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.DeleteRole;

public class DeleteRoleCommandHandler
{
    private readonly IRoleService _roleService;
    private readonly ILocalizationService _lan;

    public DeleteRoleCommandHandler(IRoleService roleService, ILocalizationService lan)
    {
        _roleService = roleService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        await _roleService.DeleteAsync(request);
        return new MessageResponse(_lan.Get("Success.RoleDeleted"));
    }
}
