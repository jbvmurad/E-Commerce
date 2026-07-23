using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmailChange;

public sealed class ConfirmEmailChangeCommandValidator : AbstractValidator<ConfirmEmailChangeCommand>
{
    public ConfirmEmailChangeCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage(lan.Get("Validation.UserIdRequired"));

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"));
    }
}
