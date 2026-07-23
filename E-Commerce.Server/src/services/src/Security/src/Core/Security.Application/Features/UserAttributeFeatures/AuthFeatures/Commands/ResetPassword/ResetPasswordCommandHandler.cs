using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ResetPasswordCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        await _authService.ResetPasswordAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.PasswordReset"));
    }
}
