using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResendEmailConfirmation;

public sealed class ResendEmailConfirmationCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ResendEmailConfirmationCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ResendEmailConfirmationCommand request, CancellationToken cancellationToken)
    {
        await _authService.ResendEmailConfirmationAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.EmailSent"));
    }
}
