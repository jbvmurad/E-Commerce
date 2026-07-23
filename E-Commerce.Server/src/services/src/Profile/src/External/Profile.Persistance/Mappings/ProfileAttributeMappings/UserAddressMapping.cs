using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.Entities.ProfileAttributeEntities;

namespace Profile.Persistance.Mappings.ProfileAttributeMappings;

public sealed class UserAddressMapping : AutoMapper.Profile
{
    public UserAddressMapping()
    {
        CreateMap<AddUserAddressCommand, UserAddress>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserProfileId, opt => opt.Ignore())
            .ForMember(dest => dest.UserProfile, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<UpdateUserAddressCommand, UserAddress>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserProfileId, opt => opt.Ignore())
            .ForMember(dest => dest.UserProfile, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<UserAddress, UserAddressResponse>();
    }
}
