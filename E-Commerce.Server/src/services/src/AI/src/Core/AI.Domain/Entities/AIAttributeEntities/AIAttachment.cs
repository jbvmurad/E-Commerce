using AI.Domain.Entities.Abstraction;
using AI.Domain.Enums;

namespace AI.Domain.Entities.AIAttributeEntities;

public sealed class AIAttachment : BaseEntity
{
    public string MessageId { get; set; } = string.Empty;
    public AIMessage Message { get; set; } = null!;
    public AIAttachmentType AttachmentType { get; set; }
    public AIAttachmentSource Source { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
}
