using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangeEmail;

public sealed class ChangeEmailCommandValidator : AbstractValidator<ChangeEmailCommand>
{
    public ChangeEmailCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage(lan.Get("Validation.UserIdRequired"));

        RuleFor(x => x.NewEmail)
            .NotEmpty().WithMessage(lan.Get("Validation.NotEmpty"))
            .EmailAddress().WithMessage(lan.Get("Validation.Email"));
    }
}
