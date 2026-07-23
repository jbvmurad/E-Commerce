using E_Commerce.Server.Shared.Localization.Localizations;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.SystemDTOs;

namespace Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;

public sealed class UpdateProfileCommandHandler
{
    private readonly IProfileService _profileService;
    private readonly ILocalizationService _lan;

    public UpdateProfileCommandHandler(IProfileService profileService, ILocalizationService lan)
    {
        _profileService = profileService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        await _profileService.UpdateMyProfileAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.ProfileUpdated"));
    }
}
