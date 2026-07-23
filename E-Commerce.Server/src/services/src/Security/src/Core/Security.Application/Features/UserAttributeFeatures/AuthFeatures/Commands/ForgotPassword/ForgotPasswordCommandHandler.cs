using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ForgotPasswordCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        await _authService.ForgotPasswordAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.EmailSent"));
    }
}
