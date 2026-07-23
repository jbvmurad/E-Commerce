using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.RegisterUser;

public sealed class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    private readonly ILocalizationService _lan;

    public RegisterUserCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.FullName)
             .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
             .Length(2, 300).WithMessage(_lan.Get("Validation.MaxLength"));

        RuleFor(x => x.Email)
             .Cascade(CascadeMode.Stop)
             .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
             .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
             .WithMessage(_lan.Get("Validation.InvalidFormat"))
             .EmailAddress().WithMessage(_lan.Get("Validation.Email"))
             .Length(5, 254).WithMessage(_lan.Get("Validation.MaxLength"));

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
            .MinimumLength(8).WithMessage(_lan.Get("Validation.MinLength"))
            .Matches("[A-Z]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[a-z]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[0-9]").WithMessage(_lan.Get("Validation.PasswordWeak"))
            .Matches("[^a-zA-Z0-9]").WithMessage(_lan.Get("Validation.PasswordWeak"));

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"))
            .Equal(x => x.Password).WithMessage(_lan.Get("Validation.PasswordMismatch"));
    }
}
