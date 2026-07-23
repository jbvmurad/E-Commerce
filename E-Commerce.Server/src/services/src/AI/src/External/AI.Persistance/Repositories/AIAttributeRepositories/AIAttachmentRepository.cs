using AI.Domain.Entities.AIAttributeEntities;
using AI.Domain.Repositories.AIAttributeRepositories;
using AI.Persistance.Context;
using GenericRepository;

namespace AI.Persistance.Repositories.AIAttributeRepositories;

public sealed class AIAttachmentRepository : Repository<AIAttachment, AIContext>, IAIAttachmentRepository
{
    public AIAttachmentRepository(AIContext context) : base(context)
    {
    }
}
