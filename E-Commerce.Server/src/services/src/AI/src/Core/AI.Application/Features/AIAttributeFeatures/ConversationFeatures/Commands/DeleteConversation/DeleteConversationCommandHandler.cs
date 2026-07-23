using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.SystemDTOs;
using E_Commerce.Server.Shared.Localization.Localizations;

namespace AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.DeleteConversation;

public sealed class DeleteConversationCommandHandler
{
    private readonly IAIConversationService _conversationService;
    private readonly ILocalizationService _lan;

    public DeleteConversationCommandHandler(
        IAIConversationService conversationService,
        ILocalizationService lan)
    {
        _conversationService = conversationService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(
        DeleteConversationCommand request,
        CancellationToken cancellationToken)
    {
        await _conversationService.DeleteConversationAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.AIConversationDeleted"));
    }
}
