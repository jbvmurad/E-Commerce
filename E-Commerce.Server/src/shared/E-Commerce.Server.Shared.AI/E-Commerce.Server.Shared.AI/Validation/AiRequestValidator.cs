using E_Commerce.Server.Shared.AI.Constants;
using E_Commerce.Server.Shared.AI.Contracts;
using E_Commerce.Server.Shared.AI.Exceptions;
using E_Commerce.Server.Shared.Localization.Localizations;

namespace E_Commerce.Server.Shared.AI.Validation;

public sealed class AiRequestValidator
{
    private readonly ILocalizationService _lan;

    public AiRequestValidator(ILocalizationService lan)
    {
        _lan = lan;
    }

    public void ValidateAndThrow(AiRequest? request)
    {
        var errors = Validate(request);

        if (errors.Count > 0)
        {
            throw new AiRequestValidationException(
                _lan.Get("Validation.AI.RequestValidationFailed"),
                errors);
        }
    }

    public IReadOnlyCollection<string> Validate(AiRequest? request)
    {
        var errors = new List<string>();

        if (request is null)
        {
            errors.Add(_lan.Get("Validation.Required"));
            return errors;
        }

        if (request.Messages is null || request.Messages.Count == 0)
        {
            errors.Add(_lan.Get("Validation.AI.MessagesRequired"));
        }
        else
        {
            ValidateMessages(request.Messages, errors);
        }

        ValidateGenerationOptions(request.GenerationOptions, errors);

        return errors;
    }

    private void ValidateMessages(
        IReadOnlyCollection<AiMessage> messages,
        ICollection<string> errors)
    {
        var index = 0;

        foreach (var message in messages)
        {
            if (message is null)
            {
                errors.Add(
                    _lan.Get(
                        "Validation.AI.MessageRequiredAtIndex",
                        index));

                index++;
                continue;
            }

            if (!AiMessageRoles.IsSupported(message.Role))
            {
                errors.Add(
                    _lan.Get(
                        "Validation.AI.MessageRoleNotSupportedAtIndex",
                        message.Role ?? string.Empty,
                        index));
            }

            if (string.IsNullOrWhiteSpace(message.Content))
            {
                errors.Add(
                    _lan.Get(
                        "Validation.AI.MessageContentRequiredAtIndex",
                        index));
            }

            index++;
        }
    }

    private void ValidateGenerationOptions(
        AiGenerationOptions? options,
        ICollection<string> errors)
    {
        if (options is null)
            return;

        if (options.Temperature is < 0 or > 2)
            errors.Add(_lan.Get("Validation.AI.TemperatureRange"));

        if (options.TopP is < 0 or > 1)
            errors.Add(_lan.Get("Validation.AI.TopPRange"));

        if (options.TopK is <= 0)
            errors.Add(_lan.Get("Validation.AI.TopKGreaterThanZero"));

        if (options.MaxOutputTokens is <= 0)
        {
            errors.Add(
                _lan.Get(
                    "Validation.AI.MaxOutputTokensGreaterThanZero"));
        }

        if (options.StopSequences?.Any(string.IsNullOrWhiteSpace) == true)
        {
            errors.Add(
                _lan.Get(
                    "Validation.AI.StopSequencesCannotContainEmptyValues"));
        }

        if (!Enum.IsDefined(options.ResponseFormat))
            errors.Add(_lan.Get("Validation.AI.ResponseFormatNotSupported"));
    }
}
