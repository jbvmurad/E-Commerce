using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

namespace Security.Application.Features.UserAttributeFeatures.AuthFeatures.Commands.CreateNewTokenByRefreshToken;

public sealed class CreateNewTokenByRefreshTokenCommandValidator : AbstractValidator<CreateNewTokenByRefreshTokenCommand>
{
    private readonly ILocalizationService _lan;

    public CreateNewTokenByRefreshTokenCommandValidator(ILocalizationService lan)
    {
        _lan = lan;

        RuleFor(x => x.UserId)
           .NotEmpty().WithMessage(_lan.Get("Validation.Required"));

        RuleFor(x => x.RefreshToken)
        .NotEmpty().WithMessage(_lan.Get("Validation.Required"));
    }
}
