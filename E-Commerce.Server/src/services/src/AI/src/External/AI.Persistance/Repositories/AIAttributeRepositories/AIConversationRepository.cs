using AI.Domain.Entities.AIAttributeEntities;
using AI.Domain.Repositories.AIAttributeRepositories;
using AI.Persistance.Context;
using GenericRepository;

namespace AI.Persistance.Repositories.AIAttributeRepositories;

public sealed class AIConversationRepository : Repository<AIConversation, AIContext>, IAIConversationRepository
{
    public AIConversationRepository(AIContext context) : base(context)
    {
    }
}
