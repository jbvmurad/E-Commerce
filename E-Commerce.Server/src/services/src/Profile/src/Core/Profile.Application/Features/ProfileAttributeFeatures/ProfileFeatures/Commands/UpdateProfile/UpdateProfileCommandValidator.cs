using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;

public sealed class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.FullName)
            .MaximumLength(200).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => !string.IsNullOrWhiteSpace(x.FullName));

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(50).WithMessage(lan.Get("Validation.MaxLength"))
            .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber));
    }
}
