using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace AI.Application.Features.AIAttributeFeatures.CustomerChatFeatures.Commands.CustomerChat;

public sealed class CustomerChatCommandValidator : AbstractValidator<CustomerChatCommand>
{
    public CustomerChatCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Message)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));
    }
}
