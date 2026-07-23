using E_Commerce.Server.Shared.Localization.Localizations;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.SystemDTOs;

namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.DeleteUserAddress;

public sealed class DeleteUserAddressCommandHandler
{
    private readonly IUserAddressService _userAddressService;
    private readonly ILocalizationService _lan;

    public DeleteUserAddressCommandHandler(IUserAddressService userAddressService, ILocalizationService lan)
    {
        _userAddressService = userAddressService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(DeleteUserAddressCommand request, CancellationToken cancellationToken)
    {
        await _userAddressService.DeleteUserAddressAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.UserAddressDeleted"));
    }
}
