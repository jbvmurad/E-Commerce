using System.Security.Claims;
using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;
using AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.DeleteConversation;
using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Domain.Entities.AIAttributeEntities;
using AI.Domain.Repositories.AIAttributeRepositories;
using E_Commerce.Server.Shared.Localization.Localizations;
using E_Commerce.Server.Shared.Storage.Services;
using GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AI.Persistance.Services.AIAttributeServices;

public sealed class AIConversationService : IAIConversationService
{
    private readonly IAIConversationRepository _conversationRepository;
    private readonly IAIMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorage _fileStorage;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILocalizationService _lan;

    public AIConversationService(
        IAIConversationRepository conversationRepository,
        IAIMessageRepository messageRepository,
        IUnitOfWork unitOfWork,
        IFileStorage fileStorage,
        IHttpContextAccessor httpContextAccessor,
        ILocalizationService lan)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _fileStorage = fileStorage;
        _httpContextAccessor = httpContextAccessor;
        _lan = lan;
    }

    public IQueryable<AIConversation> GetMyConversations()
    {
        var userId = GetCurrentUserId();

        return _conversationRepository
            .Where(x => x.UserId == userId)
            .AsNoTracking();
    }

    public IQueryable<AIMessage> GetMyMessages(string conversationId)
    {
        var userId = GetCurrentUserId();

        return _messageRepository
            .Where(x => x.ConversationId == conversationId && x.Conversation.UserId == userId)
            .AsNoTracking();
    }

    public async Task ArchiveConversationAsync(
        ArchiveConversationCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await GetOwnedConversationAsync(request.Id, cancellationToken);
        conversation.IsArchived = request.IsArchived;
        conversation.UpdatedAt = DateTime.UtcNow;

        _conversationRepository.Update(conversation);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteConversationAsync(
        DeleteConversationCommand request,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var conversation = await _conversationRepository
            .Where(x => x.Id == request.Id && x.UserId == userId)
            .Include(x => x.Messages)
                .ThenInclude(x => x.Attachments)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException(_lan.Get("Error.AIConversationNotFound"));

        var fileUrls = conversation.Messages
            .SelectMany(message => message.Attachments)
            .Select(attachment => attachment.FileUrl)
            .Where(url => !string.IsNullOrWhiteSpace(url))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        _conversationRepository.Delete(conversation);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        foreach (var fileUrl in fileUrls)
            await _fileStorage.TryDeleteAsync(fileUrl, cancellationToken);
    }

    private async Task<Domain.Entities.AIAttributeEntities.AIConversation> GetOwnedConversationAsync(
        string id,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        return await _conversationRepository
            .Where(x => x.Id == id && x.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException(_lan.Get("Error.AIConversationNotFound"));
    }

    private string GetCurrentUserId()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));
    }
}
