using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;
using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.DeleteConversation;
using AI.Domain.Entities.AIAttributeEntities;

namespace AI.Application.Services.AIAttributeServices;

public interface IAIConversationService
{
    IQueryable<AIConversation> GetMyConversations();
    IQueryable<AIMessage> GetMyMessages(string conversationId);

    Task ArchiveConversationAsync(
        ArchiveConversationCommand request,
        CancellationToken cancellationToken);

    Task DeleteConversationAsync(
        DeleteConversationCommand request,
        CancellationToken cancellationToken);
}
