using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;

public sealed class GiveUserRoleCommandValidator : AbstractValidator<GiveUserRoleCommand>
{
    private readonly ILocalizationService _lan;

    public GiveUserRoleCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"));
        RuleFor(x => x.UserId)
            .NotNull().WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.RoleId)
            .NotEmpty().WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.RoleId)
            .NotNull().WithMessage(_lan.Get("Validation.Required"));
    }
}
