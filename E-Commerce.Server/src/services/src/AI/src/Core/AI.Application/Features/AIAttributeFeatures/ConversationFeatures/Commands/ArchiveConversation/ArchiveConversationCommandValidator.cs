using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.ArchiveConversation;

public sealed class ArchiveConversationCommandValidator : AbstractValidator<ArchiveConversationCommand>
{
    public ArchiveConversationCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));
    }
}
