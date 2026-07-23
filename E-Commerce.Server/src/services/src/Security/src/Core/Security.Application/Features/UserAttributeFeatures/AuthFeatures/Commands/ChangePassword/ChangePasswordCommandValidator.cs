using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ChangePassword;

public sealed class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"));

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MinimumLength(8).WithMessage(lan.Get("Validation.MinLength"))
            .Matches("[A-Z]").WithMessage(lan.Get("Validation.PasswordWeak"))
            .Matches("[a-z]").WithMessage(lan.Get("Validation.PasswordWeak"))
            .Matches("[0-9]").WithMessage(lan.Get("Validation.PasswordWeak"))
            .Matches("[^a-zA-Z0-9]").WithMessage(lan.Get("Validation.PasswordWeak"));

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .Equal(x => x.NewPassword).WithMessage(lan.Get("Validation.PasswordMismatch"));
    }
}
