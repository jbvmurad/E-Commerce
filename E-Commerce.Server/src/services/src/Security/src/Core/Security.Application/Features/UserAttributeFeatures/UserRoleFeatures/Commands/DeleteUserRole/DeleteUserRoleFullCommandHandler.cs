using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.DeleteUserRole;

public sealed class DeleteUserRoleFullCommandHandler
{
    private readonly IUserRoleService _userRoleService;
    private readonly ILocalizationService _lan;

    public DeleteUserRoleFullCommandHandler(IUserRoleService userRoleService, ILocalizationService lan)
    {
        _userRoleService = userRoleService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(DeleteUserRoleFullCommand request, CancellationToken cancellationToken)
    {
        await _userRoleService.DeleteAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.RoleDeleted"));
    }
}
