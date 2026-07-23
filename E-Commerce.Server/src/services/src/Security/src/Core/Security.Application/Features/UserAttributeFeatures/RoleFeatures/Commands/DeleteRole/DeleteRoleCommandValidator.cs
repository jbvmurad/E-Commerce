using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.DeleteRole;

public sealed class DeleteRoleCommandValidator : AbstractValidator<DeleteRoleCommand>
{
    private readonly ILocalizationService _lan;

    public DeleteRoleCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Id)
           .NotEmpty().WithMessage(_lan.Get("Validation.Required"));
        RuleFor(x => x.Id)
           .NotNull().WithMessage(_lan.Get("Validation.Required"));
    }
}
