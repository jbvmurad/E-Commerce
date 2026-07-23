using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResendEmailConfirmation;

public sealed class ResendEmailConfirmationCommandValidator : AbstractValidator<ResendEmailConfirmationCommand>
{
    private readonly ILocalizationService _lan;

    public ResendEmailConfirmationCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
            .EmailAddress().WithMessage(_lan.Get("Validation.Email"))
            .Length(5, 254).WithMessage(_lan.Get("Validation.MaxLength"));
    }
}
