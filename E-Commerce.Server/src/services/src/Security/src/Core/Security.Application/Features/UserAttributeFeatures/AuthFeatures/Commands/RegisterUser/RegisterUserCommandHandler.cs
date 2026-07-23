using E_Commerce.Server.Shared.Localization.Localizations;
using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.SystemDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.RegisterUser;

public sealed class RegisterUserCommandHandler
{
    private readonly IAuthService _authService;
    private readonly ILocalizationService _lan;

    public RegisterUserCommandHandler(IAuthService authService, ILocalizationService lan)
    {
        _authService = authService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        await _authService.RegisterAsync(request);
        return new MessageResponse(_lan.Get("Success.Register"));
    }
}
