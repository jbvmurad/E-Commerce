using GenericRepository;
using Security.Domain.Entities.UserEntities;

namespace Security.Domain.Repositories.UserRepositories;

public interface IAuthRepository :IRepository<User> { }
