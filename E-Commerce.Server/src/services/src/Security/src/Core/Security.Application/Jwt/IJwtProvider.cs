using Security.Domain.DTOs.UserDTOs;
using Security.Domain.Entities.UserEntities;

namespace Security.Application.Jwt;

public interface IJwtProvider
{
    Task<LoginCommandResponse> CreateTokenAsync(User user);
}
