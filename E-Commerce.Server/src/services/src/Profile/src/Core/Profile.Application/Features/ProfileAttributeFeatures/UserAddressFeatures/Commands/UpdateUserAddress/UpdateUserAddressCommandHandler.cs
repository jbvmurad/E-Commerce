using E_Commerce.Server.Shared.Localization.Localizations;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.SystemDTOs;

namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;

public sealed class UpdateUserAddressCommandHandler
{
    private readonly IUserAddressService _userAddressService;
    private readonly ILocalizationService _lan;

    public UpdateUserAddressCommandHandler(IUserAddressService userAddressService, ILocalizationService lan)
    {
        _userAddressService = userAddressService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(UpdateUserAddressCommand request, CancellationToken cancellationToken)
    {
        await _userAddressService.UpdateUserAddressAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.UserAddressUpdated"));
    }
}
