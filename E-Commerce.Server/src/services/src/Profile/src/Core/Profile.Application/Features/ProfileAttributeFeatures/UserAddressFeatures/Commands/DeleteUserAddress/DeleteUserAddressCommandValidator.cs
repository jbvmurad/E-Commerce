using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.DeleteUserAddress;

public sealed class DeleteUserAddressCommandValidator : AbstractValidator<DeleteUserAddressCommand>
{
    public DeleteUserAddressCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(lan.Get("Validation.Required"));
    }
}
