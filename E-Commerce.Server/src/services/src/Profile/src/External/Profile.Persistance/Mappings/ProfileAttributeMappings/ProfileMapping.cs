using Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.Entities.ProfileAttributeEntities;

namespace Profile.Persistance.Mappings.ProfileAttributeMappings;

public sealed class ProfileMapping : AutoMapper.Profile
{
    public ProfileMapping()
    {
        CreateMap<UpdateProfileCommand, UserProfile>()
            .ForMember(dest => dest.ImageUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Addresses, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<UserProfile, ProfileResponse>();
    }
}
