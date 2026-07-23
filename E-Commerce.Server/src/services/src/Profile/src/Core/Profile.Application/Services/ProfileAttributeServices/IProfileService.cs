using Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;
using Profile.Domain.DTOs.ProfileAttributeDTOs;

namespace Profile.Application.Services.ProfileAttributeServices;

public interface IProfileService
{
    Task<ProfileResponse> GetMyProfileAsync(CancellationToken cancellationToken);
    Task UpdateMyProfileAsync(UpdateProfileCommand request, CancellationToken cancellationToken);
}
