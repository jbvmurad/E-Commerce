using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;

public sealed class GiveUserRoleCommandHandler
{
    private readonly IUserRoleService _userRoleService;
    private readonly ILocalizationService _lan;

    public GiveUserRoleCommandHandler(IUserRoleService userRoleService, ILocalizationService lan)
    {
        _userRoleService = userRoleService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(GiveUserRoleCommand request, CancellationToken cancellationToken)
    {
        await _userRoleService.GiveAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.RoleCreated"));
    }
}
