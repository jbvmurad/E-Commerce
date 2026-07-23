using AI.Domain.Enums;

namespace AI.Domain.DTOs.AIAttributeDTOs;

public sealed record AIAttachmentResponse(
    string Id,
    AIAttachmentType AttachmentType,
    AIAttachmentSource Source,
    string FileName,
    string FileUrl,
    string ContentType,
    long FileSize);
