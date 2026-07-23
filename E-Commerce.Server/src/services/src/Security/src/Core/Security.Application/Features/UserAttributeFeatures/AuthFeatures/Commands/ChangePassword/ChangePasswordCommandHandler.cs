using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangePassword;

public sealed class ChangePasswordCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ChangePasswordCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        await _authService.ChangePasswordAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.PasswordChanged"));
    }
}
