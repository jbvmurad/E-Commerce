using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.DeleteUser;

public sealed class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    private readonly ILocalizationService _lan;

    public DeleteUserCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Id)
           .NotEmpty().WithMessage(_lan.Get("Validation.Required"));
    }
}
