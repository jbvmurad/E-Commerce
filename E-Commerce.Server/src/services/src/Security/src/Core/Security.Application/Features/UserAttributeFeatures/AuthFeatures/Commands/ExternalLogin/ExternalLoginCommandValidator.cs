using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.ExternalLogin;

public sealed class ExternalLoginCommandValidator
    : AbstractValidator<ExternalLoginCommand>
{
    public ExternalLoginCommandValidator(ILocalizationService lan)
    {
        RuleFor(x => x.Provider)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));

        RuleFor(x => x.Credential)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"));

        RuleFor(x => x.Flow)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .WithMessage(lan.Get("Validation.Required"))
            .Must(flow =>
                string.Equals(flow, ExternalLoginFlows.Login, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(flow, ExternalLoginFlows.Register, StringComparison.OrdinalIgnoreCase))
            .WithMessage(lan.Get("Validation.InvalidFormat"));
    }
}
