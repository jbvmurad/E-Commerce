using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.DeleteUserRole;

public sealed class DeleteUserRoleFullCommandValidator : AbstractValidator<DeleteUserRoleFullCommand>
{
    private readonly ILocalizationService _lan;

    public DeleteUserRoleFullCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.RoleIds)
            .NotEmpty()
            .WithMessage(_lan.Get("Validation.Required"));

        RuleForEach(x => x.RoleIds)
            .NotEmpty()
            .WithMessage(_lan.Get("Validation.Required"));
    }
}
