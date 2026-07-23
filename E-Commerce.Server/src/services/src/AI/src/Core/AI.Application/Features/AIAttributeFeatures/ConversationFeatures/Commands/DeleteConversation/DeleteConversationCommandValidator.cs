using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace AI.Application.Features.AIAttributeFeatures.ConversationFeatures.Commands.DeleteConversation;

public sealed class DeleteConversationCommandValidator : AbstractValidator<DeleteConversationCommand>
{
    public DeleteConversationCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));
    }
}
