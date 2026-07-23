using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangeEmail;

public sealed class ChangeEmailCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public ChangeEmailCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
    {
        await _authService.RequestEmailChangeAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.EmailChangeRequested"));
    }
}
