using AI.Domain.Entities.AIAttributeEntities;
using AI.Domain.Repositories.AIAttributeRepositories;
using AI.Persistance.Context;
using GenericRepository;

namespace AI.Persistance.Repositories.AIAttributeRepositories;

public sealed class AIMessageRepository : Repository<AIMessage, AIContext>, IAIMessageRepository
{
    public AIMessageRepository(AIContext context) : base(context)
    {
    }
}
