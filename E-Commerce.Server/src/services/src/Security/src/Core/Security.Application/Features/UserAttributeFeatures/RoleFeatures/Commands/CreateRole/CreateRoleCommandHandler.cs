using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.CreateRole;

public sealed class CreateRoleCommandHandler
{
    private readonly IRoleService _roleService;
    private readonly ILocalizationService _lan;

    public CreateRoleCommandHandler(IRoleService roleService, ILocalizationService lan)
    {
        _roleService = roleService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        await _roleService.CreateAsync(request);
        return new MessageResponse(_lan.Get("Success.RoleCreated"));
    }
}
