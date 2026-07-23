using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmailChange;

public sealed class ConfirmEmailChangeCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ConfirmEmailChangeCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ConfirmEmailChangeCommand request, CancellationToken cancellationToken)
    {
        await _authService.ConfirmEmailChangeAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.EmailChanged"));
    }
}
