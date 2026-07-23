using GenericRepository;
using Security.Domain.Entities.UserEntities;
using Security.Domain.Repositories.UserRepositories;
using Security.Persistance.Context;

namespace Security.Persistance.Repositories.UserAttributeRepositories;

public sealed class AuthRepository : Repository<User, SecurityContext>, IAuthRepository
{
    public AuthRepository(SecurityContext context) : base(context) { }
}