using AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;
using AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;
using AI.Domain.DTOs.AIAttributeDTOs;

namespace AI.Application.Services.AIAttributeServices;

public interface IAIChatService
{
    Task<AIChatResponse> CustomerChatAsync(
        CustomerChatCommand request,
        CancellationToken cancellationToken);

    Task<AIChatResponse> SellerChatAsync(
        SellerChatCommand request,
        CancellationToken cancellationToken);
}
