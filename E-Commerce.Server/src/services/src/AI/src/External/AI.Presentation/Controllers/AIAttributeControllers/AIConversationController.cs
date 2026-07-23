using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;
using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.DeleteConversation;
using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Domain.DTOs.SystemDTOs;
using AI.Domain.Entities.AIAttributeEntities;
using AI.Presentation.Controllers.AbstractController;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace AI.Presentation.Controllers.AIAttributeControllers;

[Authorize]
[Route("api/ai/conversations")]
public sealed class AIConversationController : APIController
{
    private readonly IAIConversationService _conversationService;
    private readonly IMapper _mapper;

    public AIConversationController(
        IMessageBus bus,
        IAIConversationService conversationService,
        IMapper mapper) : base(bus)
    {
        _conversationService = conversationService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        ODataQueryOptions<AIConversation> options,
        CancellationToken cancellationToken)
    {
        IQueryable<AIConversation> query = _conversationService.GetMyConversations();

        query = (IQueryable<AIConversation>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<AIConversationResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(
        string id,
        ODataQueryOptions<AIMessage> options,
        CancellationToken cancellationToken)
    {
        IQueryable<AIMessage> query = _conversationService.GetMyMessages(id);

        query = (IQueryable<AIMessage>)options.ApplyTo(query, new ODataQuerySettings());

        var result = await query
            .ProjectTo<AIMessageResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Ok(result);
    }

    [HttpPut("{id}/archive")]
    public async Task<IActionResult> Archive(
        string id,
        [FromBody] ArchiveConversationCommand request,
        CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            request with { Id = id },
            cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(
            new DeleteConversationCommand(id),
            cancellationToken);

        return Ok(response);
    }
}
