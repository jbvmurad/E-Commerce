using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ResetPassword;

public sealed class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    private readonly ILocalizationService _lan;

    public ResetPasswordCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
            .MinimumLength(8).WithMessage(_lan.Get("Validation.MinLength"))
            .Matches("[A-Z]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[a-z]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[0-9]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[^a-zA-Z0-9]").WithMessage(_lan.Get("Validation.PasswordWeak"));

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
            .Equal(x => x.NewPassword).WithMessage(_lan.Get("Validation.PasswordMismatch"));
    }
}
