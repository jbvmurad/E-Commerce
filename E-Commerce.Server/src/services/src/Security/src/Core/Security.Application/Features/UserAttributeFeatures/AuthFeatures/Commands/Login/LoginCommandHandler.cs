using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.UserDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.Login;

public sealed class LoginCommandHandler
{
    private readonly IAuthService _authService;

    public LoginCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<LoginCommandResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        LoginCommandResponse response = await _authService.LoginAsync(request, cancellationToken);
        return response;
    }
}
