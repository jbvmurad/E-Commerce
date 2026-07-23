using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Domain.Entities.AIAttributeEntities;
using AutoMapper;

namespace AI.Persistance.Mappings.AIAttributeMappings;

public sealed class AIConversationMapping : Profile
{
    public AIConversationMapping()
    {
        CreateMap<AIConversation, AIConversationResponse>()
            .ForCtorParam("MessageCount", option => option.MapFrom(source => source.Messages.Count));
    }
}
