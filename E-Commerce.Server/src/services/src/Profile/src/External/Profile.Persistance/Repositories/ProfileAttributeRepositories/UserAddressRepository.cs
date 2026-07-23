using GenericRepository;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Domain.Repositories.ProfileAttributeRepositories;
using Profile.Persistance.Context;

namespace Profile.Persistance.Repositories.ProfileAttributeRepositories;

public sealed class UserAddressRepository : Repository<UserAddress, ProfileContext>, IUserAddressRepository
{
    public UserAddressRepository(ProfileContext context) : base(context)
    {
    }
}
