using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.DeleteUser;

public class DeleteUserCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public DeleteUserCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await _authService.DeleteAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.Deleted", "Account"));
    }
}
