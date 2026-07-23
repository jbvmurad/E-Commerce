namespace AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;

public sealed record CustomerChatCommand(
    string Message,
    string? ConversationId = null,
    string? SessionId = null);
