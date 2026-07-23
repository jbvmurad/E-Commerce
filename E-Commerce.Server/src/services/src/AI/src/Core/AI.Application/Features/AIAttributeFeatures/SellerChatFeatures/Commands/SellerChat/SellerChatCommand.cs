using Microsoft.AspNetCore.Http;

namespace AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;

public sealed record SellerChatCommand(
    string Message,
    string? ConversationId = null,
    List<IFormFile>? Files = null);
