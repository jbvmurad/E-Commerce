using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ConfirmEmail;

public sealed class ConfirmEmailCommandValidator : AbstractValidator<ConfirmEmailCommand>
{
    private readonly ILocalizationService _lan;

    public ConfirmEmailCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"));
    }
}
