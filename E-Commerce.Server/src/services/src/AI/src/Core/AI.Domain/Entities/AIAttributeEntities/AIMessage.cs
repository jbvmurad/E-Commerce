using AI.Domain.Entities.Abstraction;
using AI.Domain.Enums;

namespace AI.Domain.Entities.AIAttributeEntities;

public sealed class AIMessage : BaseEntity
{
    public string ConversationId { get; set; } = string.Empty;
    public AIConversation Conversation { get; set; } = null!;
    public AIMessageRole Role { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? InputTokenCount { get; set; }
    public int? OutputTokenCount { get; set; }

    public ICollection<AIAttachment> Attachments { get; set; }
        = new List<AIAttachment>();
}
