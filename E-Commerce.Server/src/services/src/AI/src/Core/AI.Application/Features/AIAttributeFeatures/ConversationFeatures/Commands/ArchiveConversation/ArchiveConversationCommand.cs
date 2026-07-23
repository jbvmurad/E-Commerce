namespace AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;

public sealed record ArchiveConversationCommand(string Id, bool IsArchived = true);
