using AutoMapper;
using Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.RegisterUser;
using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;

namespace Security.Persistance.Mappings.UserAttributeMaps;

public sealed class AuthMap : Profile
{
    public AuthMap()
    {
        CreateMap<RegisterUserCommand, User>().ReverseMap();
        CreateMap<UserParameters, User>().ReverseMap();
        CreateMap<User, UserResponse>();
        CreateMap<Role, RoleResponse>();
        CreateMap<UserRoleQueryModel, UserRoleResponse>();
    }
}
