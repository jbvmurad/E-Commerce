using Security.Application.Services.UserAttributeService;
using Security.Domain.DTOs.UserDTOs;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ExternalLogin;

public sealed class ExternalLoginCommandHandler
{
    private readonly IAuthService _authService;

    public ExternalLoginCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<ExternalLoginCommandResponse> Handle(
        ExternalLoginCommand request,
        CancellationToken cancellationToken)
    {
        return await _authService.ExternalLoginAsync(
            request,
            cancellationToken);
    }
}
