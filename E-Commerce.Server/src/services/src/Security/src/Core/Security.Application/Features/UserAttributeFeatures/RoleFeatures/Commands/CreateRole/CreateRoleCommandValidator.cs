using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.RoleFeatures.Commands.CreateRole;

public class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    private readonly ILocalizationService _lan;

    public CreateRoleCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.Name)
          .NotEmpty().WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.Name)
          .NotNull().WithMessage(_lan.Get("Validation.Required"));
    }
}
