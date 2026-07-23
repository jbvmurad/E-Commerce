using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Logout;

public sealed class LogoutCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public LogoutCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _authService.LogoutAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.Logout"));
    }
}
