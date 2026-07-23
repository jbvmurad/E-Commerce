using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmail;

public sealed class ConfirmEmailCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ConfirmEmailCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        await _authService.ConfirmEmailAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.EmailConfirmed"));
    }
}
