using E_Commerce.Server.Shared.Localization.Localizations;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.SystemDTOs;

namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;

public sealed class AddUserAddressCommandHandler
{
    private readonly IUserAddressService _userAddressService;
    private readonly ILocalizationService _lan;

    public AddUserAddressCommandHandler(IUserAddressService userAddressService, ILocalizationService lan)
    {
        _userAddressService = userAddressService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(AddUserAddressCommand request, CancellationToken cancellationToken)
    {
        await _userAddressService.AddUserAddressAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.UserAddressCreated"));
    }
}
