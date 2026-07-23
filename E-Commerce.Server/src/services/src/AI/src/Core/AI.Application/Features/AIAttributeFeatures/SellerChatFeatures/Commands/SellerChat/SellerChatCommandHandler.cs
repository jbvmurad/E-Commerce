using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.AIAttributeDTOs;

namespace AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;

public sealed class SellerChatCommandHandler
{
    private readonly IAIChatService _aiChatService;

    public SellerChatCommandHandler(IAIChatService aiChatService)
    {
        _aiChatService = aiChatService;
    }

    public Task<AIChatResponse> Handle(
        SellerChatCommand request,
        CancellationToken cancellationToken)
    {
        return _aiChatService.SellerChatAsync(request, cancellationToken);
    }
}
