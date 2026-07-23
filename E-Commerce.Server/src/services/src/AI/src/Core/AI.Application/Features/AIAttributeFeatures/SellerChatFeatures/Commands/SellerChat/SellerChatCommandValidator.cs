using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace AI.Application.Features.AIAttributeFeatures.SellerChatFeatures.Commands.SellerChat;

public sealed class SellerChatCommandValidator : AbstractValidator<SellerChatCommand>
{
    private const int MaximumFileCount = 5;

    private static readonly HashSet<string> SupportedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    };

    public SellerChatCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Message)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));

        RuleFor(x => x.Files)
            .Must(files => files is null || files.Count <= MaximumFileCount)
            .WithMessage(lan.Get("Validation.AI.MaximumFileCount"));

        RuleForEach(x => x.Files)
            .Must(file => file is not null && file.Length > 0)
            .WithMessage(lan.Get("Validation.AI.EmptyFileNotAllowed"))
            .Must(IsSupportedFile)
            .WithMessage(lan.Get("Validation.AI.FileTypeNotSupported"))
            .When(x => x.Files is not null);
    }

    private static bool IsSupportedFile(IFormFile file)
    {
        if (file is null)
            return false;

        return SupportedContentTypes.Contains(file.ContentType);
    }
}
