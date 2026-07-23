using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.AIAttributeDTOs;

namespace AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;

public sealed class CustomerChatCommandHandler
{
    private readonly IAIChatService _aiChatService;

    public CustomerChatCommandHandler(IAIChatService aiChatService)
    {
        _aiChatService = aiChatService;
    }

    public Task<AIChatResponse> Handle(
        CustomerChatCommand request,
        CancellationToken cancellationToken)
    {
        return _aiChatService.CustomerChatAsync(request, cancellationToken);
    }
}
