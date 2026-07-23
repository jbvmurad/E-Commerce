using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.AddUserAddress;

public sealed class AddUserAddressCommandValidator : AbstractValidator<AddUserAddressCommand>
{
    public AddUserAddressCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MaximumLength(100).WithMessage(lan.Get("Validation.MaxLength"));

        RuleFor(x => x.RecipientFullName)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MaximumLength(200).WithMessage(lan.Get("Validation.MaxLength"));

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MaximumLength(50).WithMessage(lan.Get("Validation.MaxLength"));

        RuleFor(x => x.CountryCode)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .Length(2).WithMessage(lan.Get("Validation.CountryCode"));

        RuleFor(x => x.City)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MaximumLength(150).WithMessage(lan.Get("Validation.MaxLength"));

        RuleFor(x => x.AddressLine1)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"))
            .MaximumLength(500).WithMessage(lan.Get("Validation.MaxLength"));

        RuleFor(x => x.StateOrRegion)
            .MaximumLength(150).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => x.StateOrRegion is not null);

        RuleFor(x => x.District)
            .MaximumLength(150).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => x.District is not null);

        RuleFor(x => x.AddressLine2)
            .MaximumLength(500).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => x.AddressLine2 is not null);

        RuleFor(x => x.PostalCode)
            .MaximumLength(30).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => x.PostalCode is not null);
    }
}
