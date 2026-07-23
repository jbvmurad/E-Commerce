using GenericRepository;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Domain.Repositories.ProfileAttributeRepositories;
using Profile.Persistance.Context;

namespace Profile.Persistance.Repositories.ProfileAttributeRepositories;

public sealed class ProfileRepository : Repository<UserProfile, ProfileContext>, IProfileRepository
{
    public ProfileRepository(ProfileContext context) : base(context)
    {
    }
}
