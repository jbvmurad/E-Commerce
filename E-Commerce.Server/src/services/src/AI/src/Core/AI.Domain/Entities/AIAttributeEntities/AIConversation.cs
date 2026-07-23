using AI.Domain.Entities.Abstraction;
using AI.Domain.Enums;

namespace AI.Domain.Entities.AIAttributeEntities;

public sealed class AIConversation : BaseEntity
{
    public string? UserId { get; set; }
    public string? SessionId { get; set; }
    public string? Title { get; set; }
    public AIConversationType ConversationType { get; set; }
    public bool IsArchived { get; set; }

    public ICollection<AIMessage> Messages { get; set; }
        = new List<AIMessage>();
}
