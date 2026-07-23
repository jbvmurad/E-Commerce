using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.SystemDTOs;
using E_Commerce.Server.Shared.Localization.Localizations;

namespace AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;

public sealed class ArchiveConversationCommandHandler
{
    private readonly IAIConversationService _conversationService;
    private readonly ILocalizationService _lan;

    public ArchiveConversationCommandHandler(
        IAIConversationService conversationService,
        ILocalizationService lan)
    {
        _conversationService = conversationService;
        _lan = lan;
    }

    public async Task<MessageResponse> Handle(
        ArchiveConversationCommand request,
        CancellationToken cancellationToken)
    {
        await _conversationService.ArchiveConversationAsync(request, cancellationToken);
        return new MessageResponse(_lan.Get("Success.AIConversationArchived"));
    }
}
