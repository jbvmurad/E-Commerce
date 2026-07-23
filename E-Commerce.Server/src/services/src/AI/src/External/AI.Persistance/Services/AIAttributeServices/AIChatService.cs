using System.Security.Claims;
using AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;
using AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;
using AI.Application.Services.AIAttributeServices;
using AI.Domain.DTOs.AIAttributeDTOs;
using AI.Domain.DTOs.SystemDTOs;
using AI.Domain.Entities.AIAttributeEntities;
using AI.Domain.Enums;
using AI.Domain.Repositories.AIAttributeRepositories;
using AutoMapper;
using E_Commerce.Server.Shared.AI.Abstractions;
using E_Commerce.Server.Shared.Localization.Localizations;
using E_Commerce.Server.Shared.Storage.Services;
using FluentValidation;
using FluentValidation.Results;
using GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SharedAiFile = E_Commerce.Server.Shared.AI.Contracts.AiFile;
using SharedAiGenerationOptions = E_Commerce.Server.Shared.AI.Contracts.AiGenerationOptions;
using SharedAiMessage = E_Commerce.Server.Shared.AI.Contracts.AiMessage;
using SharedAiRequest = E_Commerce.Server.Shared.AI.Contracts.AiRequest;

namespace AI.Persistance.Services.AIAttributeServices;

public sealed class AIChatService : IAIChatService
{
    private const int MaximumFileCount = 5;
    private const int HistoryMessageCount = 30;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly IAIConversationRepository _conversationRepository;
    private readonly IAIMessageRepository _messageRepository;
    private readonly IAIAttachmentRepository _attachmentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAiProvider _aiProvider;
    private readonly IFileStorage _fileStorage;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILocalizationService _lan;

    public AIChatService(
        IAIConversationRepository conversationRepository,
        IAIMessageRepository messageRepository,
        IAIAttachmentRepository attachmentRepository,
        IUnitOfWork unitOfWork,
        IAiProvider aiProvider,
        IFileStorage fileStorage,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor,
        ILocalizationService lan)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _attachmentRepository = attachmentRepository;
        _unitOfWork = unitOfWork;
        _aiProvider = aiProvider;
        _fileStorage = fileStorage;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
        _lan = lan;
    }

    public async Task<AIChatResponse> CustomerChatAsync(
        CustomerChatCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = ResolveCurrentUser(request.SessionId, requireAuthenticated: false);
        var conversation = await GetOrCreateConversationAsync(
            request.ConversationId,
            currentUser,
            AIConversationType.Customer,
            request.Message,
            cancellationToken);

        await AddMessageAsync(
            conversation,
            AIMessageRole.User,
            request.Message,
            cancellationToken);

        var aiRequest = await BuildAIRequestAsync(
            conversation.Id,
            CustomerSystemPrompt(_lan.GetCurrentLanguage()),
            cancellationToken);

        var aiResponse = await _aiProvider.GenerateAsync(aiRequest, cancellationToken);

        var assistantMessage = await AddMessageAsync(
            conversation,
            AIMessageRole.Assistant,
            aiResponse.Content,
            cancellationToken,
            aiResponse.Usage?.InputTokens,
            aiResponse.Usage?.OutputTokens);

        return new AIChatResponse(
            conversation.Id,
            assistantMessage.Id,
            assistantMessage.Content,
            Array.Empty<AIAttachmentResponse>());
    }

    public async Task<AIChatResponse> SellerChatAsync(
        SellerChatCommand request,
        CancellationToken cancellationToken)
    {
        var currentUser = ResolveCurrentUser(sessionId: null, requireAuthenticated: true);
        var files = request.Files ?? new List<IFormFile>();

        await ValidateFilesAsync(files, cancellationToken);

        var conversation = await GetOrCreateConversationAsync(
            request.ConversationId,
            currentUser,
            AIConversationType.Seller,
            request.Message,
            cancellationToken);

        var userMessage = await AddMessageAsync(
            conversation,
            AIMessageRole.User,
            request.Message,
            cancellationToken);

        await SaveUserAttachmentsAsync(
            userMessage,
            currentUser.UserId!,
            conversation.Id,
            files,
            cancellationToken);

        if (files.Count == 0 && IsImageGenerationRequest(request.Message))
        {
            return await GenerateSellerImageAsync(
                conversation,
                request.Message,
                currentUser.UserId!,
                cancellationToken);
        }

        var aiRequest = await BuildAIRequestAsync(
            conversation.Id,
            SellerSystemPrompt(_lan.GetCurrentLanguage()),
            cancellationToken);

        SharedAiFile[] providerFiles = files
            .Select(file => new SharedAiFile(
                Path.GetFileName(file.FileName),
                file.ContentType,
                file.Length,
                file.OpenReadStream))
            .ToArray();

        var aiResponse = await _aiProvider.GenerateAsync(
            aiRequest,
            providerFiles,
            cancellationToken);

        var assistantMessage = await AddMessageAsync(
            conversation,
            AIMessageRole.Assistant,
            aiResponse.Content,
            cancellationToken,
            aiResponse.Usage?.InputTokens,
            aiResponse.Usage?.OutputTokens);

        return new AIChatResponse(
            conversation.Id,
            assistantMessage.Id,
            assistantMessage.Content,
            Array.Empty<AIAttachmentResponse>());
    }

    private async Task<AIChatResponse> GenerateSellerImageAsync(
        AIConversation conversation,
        string prompt,
        string userId,
        CancellationToken cancellationToken)
    {
        var generated = await _aiProvider.GenerateImageAsync(prompt, cancellationToken);
        var content = string.IsNullOrWhiteSpace(generated.Description)
            ? _lan.Get("Success.AIImageGenerated")
            : generated.Description!;

        var assistantMessage = await AddMessageAsync(
            conversation,
            AIMessageRole.Assistant,
            content,
            cancellationToken);

        await using var imageStream = new MemoryStream(generated.Content, writable: false);
        var fileName = $"generated-{DateTime.UtcNow:yyyyMMddHHmmss}{generated.FileExtension}";
        var formFile = new FormFile(imageStream, 0, generated.Content.LongLength, "file", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = generated.ContentType
        };

        var folder = BuildStorageFolder("generated", userId, conversation.Id);
        var fileUrl = await _fileStorage.SaveFileAsync(formFile, folder, cancellationToken);

        var attachment = new AIAttachment
        {
            MessageId = assistantMessage.Id,
            AttachmentType = AIAttachmentType.Image,
            Source = AIAttachmentSource.AIGenerated,
            FileName = fileName,
            FileUrl = fileUrl,
            ContentType = generated.ContentType,
            FileSize = generated.Content.LongLength
        };

        await _attachmentRepository.AddAsync(attachment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var attachmentResponse = _mapper.Map<AIAttachmentResponse>(attachment);

        return new AIChatResponse(
            conversation.Id,
            assistantMessage.Id,
            assistantMessage.Content,
            new[] { attachmentResponse },
            fileUrl);
    }

    private async Task SaveUserAttachmentsAsync(
        AIMessage message,
        string userId,
        string conversationId,
        IReadOnlyCollection<IFormFile> files,
        CancellationToken cancellationToken)
    {
        if (files.Count == 0)
            return;

        var folder = BuildStorageFolder("uploads", userId, conversationId);

        foreach (var file in files)
        {
            var fileUrl = await _fileStorage.SaveFileAsync(file, folder, cancellationToken);
            var attachment = new AIAttachment
            {
                MessageId = message.Id,
                AttachmentType = GetAttachmentType(file),
                Source = AIAttachmentSource.UserUpload,
                FileName = Path.GetFileName(file.FileName),
                FileUrl = fileUrl,
                ContentType = file.ContentType,
                FileSize = file.Length
            };

            await _attachmentRepository.AddAsync(attachment);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<AIMessage> AddMessageAsync(
        AIConversation conversation,
        AIMessageRole role,
        string content,
        CancellationToken cancellationToken,
        int? inputTokenCount = null,
        int? outputTokenCount = null)
    {
        var message = new AIMessage
        {
            ConversationId = conversation.Id,
            Role = role,
            Content = content.Trim(),
            InputTokenCount = inputTokenCount,
            OutputTokenCount = outputTokenCount
        };

        conversation.UpdatedAt = DateTime.UtcNow;
        _conversationRepository.Update(conversation);
        await _messageRepository.AddAsync(message);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return message;
    }

    private async Task<AIConversation> GetOrCreateConversationAsync(
        string? conversationId,
        CurrentAIUser currentUser,
        AIConversationType conversationType,
        string firstMessage,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(conversationId))
        {
            var existing = await _conversationRepository
                .Where(x => x.Id == conversationId && x.ConversationType == conversationType)
                .FirstOrDefaultAsync(cancellationToken)
                ?? throw new KeyNotFoundException(_lan.Get("Error.AIConversationNotFound"));

            EnsureConversationOwnership(existing, currentUser);
            return existing;
        }

        var conversation = new AIConversation
        {
            UserId = currentUser.UserId,
            SessionId = currentUser.IsAuthenticated ? null : currentUser.SessionId,
            Title = CreateTitle(firstMessage),
            ConversationType = conversationType,
            IsArchived = false
        };

        await _conversationRepository.AddAsync(conversation);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return conversation;
    }

    private async Task<SharedAiRequest> BuildAIRequestAsync(
        string conversationId,
        string systemPrompt,
        CancellationToken cancellationToken)
    {
        var history = await _messageRepository
            .Where(x => x.ConversationId == conversationId)
            .OrderByDescending(x => x.CreatedAt)
            .Take(HistoryMessageCount)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        var messages = new List<SharedAiMessage>
        {
            SharedAiMessage.System(systemPrompt)
        };

        messages.AddRange(history.Select(message => message.Role switch
        {
            AIMessageRole.Assistant => SharedAiMessage.Assistant(message.Content),
            AIMessageRole.System => SharedAiMessage.System(message.Content),
            _ => SharedAiMessage.User(message.Content)
        }));

        return new SharedAiRequest(
            messages,
            new SharedAiGenerationOptions(
                Temperature: 0.5,
                TopP: 0.9,
                MaxOutputTokens: 4096),
            RequestId: Guid.NewGuid().ToString("N"));
    }

    private CurrentAIUser ResolveCurrentUser(string? sessionId, bool requireAuthenticated)
    {
        var principal = _httpContextAccessor.HttpContext?.User;
        var isAuthenticated = principal?.Identity?.IsAuthenticated == true;
        var userId = isAuthenticated
            ? principal!.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;

        if (requireAuthenticated && string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));

        if (!isAuthenticated && string.IsNullOrWhiteSpace(sessionId))
            throw ToValidationException(_lan.Get("Validation.AI.SessionIdRequired"));

        return new CurrentAIUser(
            string.IsNullOrWhiteSpace(userId) ? null : userId.Trim(),
            string.IsNullOrWhiteSpace(sessionId) ? null : sessionId.Trim(),
            isAuthenticated);
    }

    private void EnsureConversationOwnership(
        AIConversation conversation,
        CurrentAIUser currentUser)
    {
        var ownsConversation = currentUser.IsAuthenticated
            ? string.Equals(conversation.UserId, currentUser.UserId, StringComparison.Ordinal)
            : conversation.UserId is null &&
              string.Equals(conversation.SessionId, currentUser.SessionId, StringComparison.Ordinal);

        if (!ownsConversation)
            throw new UnauthorizedAccessException(_lan.Get("Validation.Unauthorized"));
    }

    private async Task ValidateFilesAsync(
        IReadOnlyCollection<IFormFile> files,
        CancellationToken cancellationToken)
    {
        if (files.Count > MaximumFileCount)
            throw ToValidationException(_lan.Get("Validation.AI.MaximumFileCount"));

        foreach (var file in files)
        {
            if (file is null || file.Length == 0)
                throw ToValidationException(_lan.Get("Validation.AI.EmptyFileNotAllowed"));

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(extension) || !await HasValidMagicBytesAsync(file, cancellationToken))
                throw ToValidationException(_lan.Get("Validation.AI.FileTypeNotSupported"));
        }
    }

    private static async Task<bool> HasValidMagicBytesAsync(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var header = new byte[12];
        await using var stream = file.OpenReadStream();
        var bytesRead = await stream.ReadAsync(header.AsMemory(0, header.Length), cancellationToken);

        if (bytesRead < 4)
            return false;

        if (header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46)
            return file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase);

        if (header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            return file.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)
                || file.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase);

        if (header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47)
            return file.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase);

        return bytesRead >= 12
            && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
            && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50
            && file.ContentType.Equals("image/webp", StringComparison.OrdinalIgnoreCase);
    }

    private static AIAttachmentType GetAttachmentType(IFormFile file)
    {
        return file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase)
            ? AIAttachmentType.Pdf
            : AIAttachmentType.Image;
    }

    private static string BuildStorageFolder(string category, string userId, string conversationId)
    {
        return $"uploads/ai/{category}/{SanitizeSegment(userId)}/{SanitizeSegment(conversationId)}";
    }

    private static string SanitizeSegment(string value)
    {
        var sanitized = new string(value.Where(character =>
            char.IsLetterOrDigit(character) || character is '-' or '_').ToArray());

        return string.IsNullOrWhiteSpace(sanitized) ? "unknown" : sanitized;
    }

    private static string CreateTitle(string message)
    {
        var normalized = string.Join(" ", message.Split(
            new[] { ' ', '\r', '\n', '\t' },
            StringSplitOptions.RemoveEmptyEntries));

        return normalized.Length <= 80 ? normalized : normalized[..80].TrimEnd() + "…";
    }

    private static bool IsImageGenerationRequest(string message)
    {
        var value = message.ToLowerInvariant();
        var phrases = new[]
        {
            "görsel oluştur", "görsel üret", "resim oluştur", "resim üret",
            "şəkil yarat", "şəkil hazırla", "şəkil oluştur",
            "generate an image", "create an image", "make an image",
            "создай изображение", "сгенерируй изображение", "создай картинку"
        };

        return phrases.Any(value.Contains);
    }

    private static ValidationException ToValidationException(string message)
    {
        return new ValidationException(new[]
        {
            new ValidationFailure(string.Empty, message)
        });
    }

    private static string CustomerSystemPrompt(string language)
    {
        return $"""
You are the customer support AI assistant for an e-commerce platform.
Answer in the user's language. The resolved language code is: {language}.
Help with product discovery, general payment guidance, delivery concepts, returns and platform usage.
Never invent live order, stock, price, account or payment data. If live data is required and no tool result is present, clearly say that the relevant page or support channel must be checked.
Do not claim that an order was shipped, paid, refunded or cancelled unless verified data is provided.
Keep answers practical, polite and concise.
""";
    }

    private static string SellerSystemPrompt(string language)
    {
        return $"""
You are the seller AI assistant for an e-commerce platform.
Answer in the seller's language. The resolved language code is: {language}.
Help with product ideas, titles, descriptions, SEO keywords, campaign concepts, customer communication and sales improvement.
When images or PDF files are attached, analyze only the supplied files and clearly distinguish observed facts from suggestions.
Do not invent certifications, product specifications, legal claims, prices, stock or sales results.
Provide structured, actionable guidance suitable for a seller dashboard.
""";
    }
}
