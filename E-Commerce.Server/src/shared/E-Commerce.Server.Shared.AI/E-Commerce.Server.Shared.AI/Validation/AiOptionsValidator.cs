using E_Commerce.Server.Shared.AI.Options;
using Microsoft.Extensions.Options;

namespace E_Commerce.Server.Shared.AI.Validation;

internal sealed class AiOptionsValidator : IValidateOptions<AiOptions>
{
    public ValidateOptionsResult Validate(string? name, AiOptions options)
    {
        if (options is null)
            return ValidateOptionsResult.Fail("AI configuration is missing.");

        if (!options.Enabled)
            return ValidateOptionsResult.Success;

        var failures = new List<string>();

        if (options.RequestTimeoutSeconds <= 0)
            failures.Add("AI:RequestTimeoutSeconds must be greater than zero.");

        if (options.MaxRetries < 0)
            failures.Add("AI:MaxRetries cannot be negative.");

        ValidateGeminiOptions(options.Gemini, failures);

        return failures.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(failures);
    }

    private static void ValidateGeminiOptions(
        GeminiOptions? options,
        ICollection<string> failures)
    {
        if (options is null)
        {
            failures.Add("AI:Gemini configuration is missing.");
            return;
        }

        if (string.IsNullOrWhiteSpace(options.ApiKey))
            failures.Add("AI:Gemini:ApiKey is required when AI is enabled.");

        if (string.IsNullOrWhiteSpace(options.Model))
            failures.Add("AI:Gemini:Model is required when AI is enabled.");

        if (string.IsNullOrWhiteSpace(options.ApiVersion))
            failures.Add("AI:Gemini:ApiVersion is required when AI is enabled.");

        if (string.IsNullOrWhiteSpace(options.BaseUrl))
        {
            failures.Add("AI:Gemini:BaseUrl is required when AI is enabled.");
        }
        else if (!Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out var uri)
                 || (uri.Scheme != Uri.UriSchemeHttp
                     && uri.Scheme != Uri.UriSchemeHttps))
        {
            failures.Add("AI:Gemini:BaseUrl must be a valid HTTP or HTTPS URL.");
        }
    }
}
