using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Domain.Entities.AIAttributeEntities;
using AutoMapper;

namespace AI.Persistance.Mappings.AIAttributeMappings;

public sealed class AIMessageMapping : Profile
{
    public AIMessageMapping()
    {
        CreateMap<AIMessage, AIMessageResponse>();
        CreateMap<AIAttachment, AIAttachmentResponse>();
    }
}
