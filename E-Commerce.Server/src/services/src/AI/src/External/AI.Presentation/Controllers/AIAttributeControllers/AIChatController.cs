using AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;
using AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;
using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Presentation.Controllers.AbstractController;
using E_Commerce.Server.Shared.Authorization.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Wolverine;

namespace AI.Presentation.Controllers.AIAttributeControllers;

[Route("api/ai")]
public sealed class AIChatController : APIController
{
    public AIChatController(IMessageBus bus) : base(bus)
    {
    }

    [AllowAnonymous]
    [EnableRateLimiting("ai-customer-chat")]
    [HttpPost("customer/chat")]
    public async Task<ActionResult<AIChatResponse>> CustomerChat(
        [FromBody] CustomerChatCommand request,
        CancellationToken cancellationToken)
    {
        AIChatResponse response = await _bus.InvokeAsync<AIChatResponse>(request, cancellationToken);
        return Ok(response);
    }

    [Authorize(Roles = ApplicationRoles.Seller)]
    [EnableRateLimiting("ai-seller-chat")]
    [Consumes("multipart/form-data")]
    [HttpPost("seller/chat")]
    public async Task<ActionResult<AIChatResponse>> SellerChat(
        [FromForm] SellerChatCommand request,
        CancellationToken cancellationToken)
    {
        AIChatResponse response = await _bus.InvokeAsync<AIChatResponse>(request, cancellationToken);
        return Ok(response);
    }
}
