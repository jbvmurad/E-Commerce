using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.DeleteUserAddress;
using Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;
using Profile.Domain.Entities.ProfileAttributeEntities;

namespace Profile.Application.Services.ProfileAttributeServices;

public interface IUserAddressService
{
    IQueryable<UserAddress> GetMyAddresses();
    Task AddUserAddressAsync(AddUserAddressCommand request, CancellationToken cancellationToken);
    Task UpdateUserAddressAsync(UpdateUserAddressCommand request, CancellationToken cancellationToken);
    Task DeleteUserAddressAsync(DeleteUserAddressCommand request, CancellationToken cancellationToken);
}
