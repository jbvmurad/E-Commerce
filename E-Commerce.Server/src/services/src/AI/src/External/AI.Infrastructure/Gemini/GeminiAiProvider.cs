using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using E_Commerce.Server.Shared.AI.Abstractions;
using E_Commerce.Server.Shared.AI.Constants;
using E_Commerce.Server.Shared.AI.Contracts;
using E_Commerce.Server.Shared.AI.Exceptions;
using E_Commerce.Server.Shared.AI.Options;
using E_Commerce.Server.Shared.AI.Validation;
using Microsoft.Extensions.Options;

namespace AI.Infrastructure.Gemini;

public sealed class GeminiAiProvider : IAiProvider
{
    private readonly HttpClient _httpClient;
    private readonly AiOptions _options;
    private readonly AiRequestValidator _requestValidator;

    public GeminiAiProvider(
        HttpClient httpClient,
        IOptions<AiOptions> options,
        AiRequestValidator requestValidator)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _requestValidator = requestValidator;
    }

    public Task<AiResponse> GenerateAsync(
        AiRequest request,
        CancellationToken cancellationToken = default)
    {
        return GenerateAsync(
            request,
            Array.Empty<AiFile>(),
            cancellationToken);
    }

    public async Task<AiResponse> GenerateAsync(
        AiRequest request,
        IReadOnlyCollection<AiFile> files,
        CancellationToken cancellationToken = default)
    {
        EnsureConfigured(requireImageModel: false);
        _requestValidator.ValidateAndThrow(request);

        using CancellationTokenSource timeout =
            CreateTimeoutToken(cancellationToken);

        var uploadedFiles = new List<GeminiFileReference>();

        foreach (AiFile file in files)
        {
            uploadedFiles.Add(
                await UploadFileAsync(file, timeout.Token));
        }

        string model = string.IsNullOrWhiteSpace(request.Model)
            ? _options.Gemini.Model
            : request.Model.Trim();

        object payload = BuildGenerateContentPayload(
            request,
            uploadedFiles);

        string endpoint = BuildModelEndpoint(
            model,
            "generateContent");

        using HttpResponseMessage response =
            await SendJsonWithRetryAsync(
                endpoint,
                payload,
                timeout.Token);

        string body =
            await response.Content.ReadAsStringAsync(timeout.Token);

        EnsureSuccess(response);

        using JsonDocument document = JsonDocument.Parse(body);

        return ParseTextResponse(
            document.RootElement,
            model,
            request.RequestId);
    }

    public async Task<AiGeneratedImage> GenerateImageAsync(
        string prompt,
        CancellationToken cancellationToken = default)
    {
        EnsureConfigured(requireImageModel: true);

        if (string.IsNullOrWhiteSpace(prompt))
        {
            throw new ArgumentException(
                "Image prompt is required.",
                nameof(prompt));
        }

        using CancellationTokenSource timeout =
            CreateTimeoutToken(cancellationToken);

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = prompt.Trim() }
                    }
                }
            },
            generationConfig = new
            {
                responseModalities = new[]
                {
                    "TEXT",
                    "IMAGE"
                }
            }
        };

        string endpoint = BuildModelEndpoint(
            _options.Gemini.ImageModel,
            "generateContent");

        using HttpResponseMessage response =
            await SendJsonWithRetryAsync(
                endpoint,
                payload,
                timeout.Token);

        string body =
            await response.Content.ReadAsStringAsync(timeout.Token);

        EnsureSuccess(response);

        using JsonDocument document = JsonDocument.Parse(body);
        return ParseImageResponse(document.RootElement);
    }

    private object BuildGenerateContentPayload(
        AiRequest request,
        IReadOnlyCollection<GeminiFileReference> files)
    {
        string systemText = string.Join(
            "\n\n",
            request.Messages
                .Where(message => string.Equals(
                    message.Role,
                    AiMessageRoles.System,
                    StringComparison.OrdinalIgnoreCase))
                .Select(message => message.Content));

        List<AiMessage> nonSystemMessages = request.Messages
            .Where(message => !string.Equals(
                message.Role,
                AiMessageRoles.System,
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        int lastUserIndex = nonSystemMessages.FindLastIndex(
            message => string.Equals(
                message.Role,
                AiMessageRoles.User,
                StringComparison.OrdinalIgnoreCase));

        var contents = new List<object>();

        for (var index = 0; index < nonSystemMessages.Count; index++)
        {
            AiMessage message = nonSystemMessages[index];
            var parts = new List<object>
            {
                new { text = message.Content }
            };

            if (index == lastUserIndex)
            {
                parts.AddRange(
                    files.Select(file => (object)new
                    {
                        file_data = new
                        {
                            mime_type = file.MimeType,
                            file_uri = file.Uri
                        }
                    }));
            }

            contents.Add(new
            {
                role = string.Equals(
                    message.Role,
                    AiMessageRoles.Assistant,
                    StringComparison.OrdinalIgnoreCase)
                    ? "model"
                    : "user",
                parts
            });
        }

        AiGenerationOptions? options = request.GenerationOptions;

        object? generationConfig = options is null
            ? null
            : new
            {
                temperature = options.Temperature,
                topP = options.TopP,
                topK = options.TopK,
                maxOutputTokens = options.MaxOutputTokens,
                stopSequences = options.StopSequences,
                responseMimeType =
                    options.ResponseFormat == AiResponseFormat.Json
                        ? "application/json"
                        : "text/plain",
                responseJsonSchema = options.ResponseJsonSchema
            };

        return new
        {
            systemInstruction = string.IsNullOrWhiteSpace(systemText)
                ? null
                : new
                {
                    parts = new[]
                    {
                        new { text = systemText }
                    }
                },
            contents,
            generationConfig
        };
    }

    private async Task<GeminiFileReference> UploadFileAsync(
        AiFile file,
        CancellationToken cancellationToken)
    {
        string startEndpoint =
            $"{_options.Gemini.BaseUrl.TrimEnd('/')}/upload/{_options.Gemini.ApiVersion.Trim('/')}/files";

        using var startRequest = new HttpRequestMessage(
            HttpMethod.Post,
            startEndpoint);

        startRequest.Headers.TryAddWithoutValidation(
            "x-goog-api-key",
            _options.Gemini.ApiKey);

        startRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Protocol",
            "resumable");

        startRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Command",
            "start");

        startRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Header-Content-Length",
            file.Length.ToString());

        startRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Header-Content-Type",
            file.ContentType);

        startRequest.Content = new StringContent(
            JsonSerializer.Serialize(new
            {
                file = new
                {
                    display_name = Path.GetFileName(file.FileName)
                }
            }),
            Encoding.UTF8,
            "application/json");

        using HttpResponseMessage startResponse =
            await _httpClient.SendAsync(
                startRequest,
                cancellationToken);

        EnsureSuccess(startResponse);

        if (!startResponse.Headers.TryGetValues(
                "X-Goog-Upload-URL",
                out IEnumerable<string>? uploadUrls))
        {
            throw new AiProviderException(
                "Gemini file upload URL was not returned.");
        }

        string? uploadUrl = uploadUrls.FirstOrDefault();

        if (string.IsNullOrWhiteSpace(uploadUrl))
        {
            throw new AiProviderException(
                "Gemini file upload URL is empty.");
        }

        await using Stream input = file.OpenReadStream();
        using var uploadRequest = new HttpRequestMessage(
            HttpMethod.Post,
            uploadUrl);

        uploadRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Offset",
            "0");

        uploadRequest.Headers.TryAddWithoutValidation(
            "X-Goog-Upload-Command",
            "upload, finalize");

        var streamContent = new StreamContent(input);
        streamContent.Headers.ContentLength = file.Length;
        streamContent.Headers.ContentType =
            MediaTypeHeaderValue.Parse(file.ContentType);

        uploadRequest.Content = streamContent;

        using HttpResponseMessage uploadResponse =
            await _httpClient.SendAsync(
                uploadRequest,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

        string uploadBody =
            await uploadResponse.Content.ReadAsStringAsync(
                cancellationToken);

        EnsureSuccess(uploadResponse);

        using JsonDocument document = JsonDocument.Parse(uploadBody);
        JsonElement fileElement =
            document.RootElement.GetProperty("file");

        var reference = new GeminiFileReference(
            fileElement.GetProperty("name").GetString()
                ?? string.Empty,
            fileElement.GetProperty("uri").GetString()
                ?? string.Empty,
            GetOptionalString(fileElement, "mimeType")
                ?? file.ContentType,
            GetOptionalString(fileElement, "state"));

        return await WaitUntilFileIsActiveAsync(
            reference,
            cancellationToken);
    }

    private async Task<GeminiFileReference> WaitUntilFileIsActiveAsync(
        GeminiFileReference file,
        CancellationToken cancellationToken)
    {
        if (!string.Equals(
                file.State,
                "PROCESSING",
                StringComparison.OrdinalIgnoreCase))
        {
            return file;
        }

        for (var attempt = 0; attempt < 60; attempt++)
        {
            await Task.Delay(
                TimeSpan.FromSeconds(1),
                cancellationToken);

            string endpoint =
                $"{_options.Gemini.BaseUrl.TrimEnd('/')}/{_options.Gemini.ApiVersion.Trim('/')}/{file.Name}";

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                endpoint);

            request.Headers.TryAddWithoutValidation(
                "x-goog-api-key",
                _options.Gemini.ApiKey);

            using HttpResponseMessage response =
                await _httpClient.SendAsync(
                    request,
                    cancellationToken);

            string body =
                await response.Content.ReadAsStringAsync(
                    cancellationToken);

            EnsureSuccess(response);

            using JsonDocument document = JsonDocument.Parse(body);
            JsonElement root = document.RootElement;
            string? state = GetOptionalString(root, "state");

            if (string.Equals(
                    state,
                    "ACTIVE",
                    StringComparison.OrdinalIgnoreCase))
            {
                return file with
                {
                    Uri = GetOptionalString(root, "uri") ?? file.Uri,
                    MimeType =
                        GetOptionalString(root, "mimeType")
                        ?? file.MimeType,
                    State = state
                };
            }

            if (string.Equals(
                    state,
                    "FAILED",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new AiProviderException(
                    "Gemini could not process the uploaded file.");
            }
        }

        throw new AiProviderException(
            "Gemini file processing timed out.");
    }

    private async Task<HttpResponseMessage> SendJsonWithRetryAsync(
        string endpoint,
        object payload,
        CancellationToken cancellationToken)
    {
        string json = JsonSerializer.Serialize(
            payload,
            new JsonSerializerOptions
            {
                DefaultIgnoreCondition =
                    JsonIgnoreCondition.WhenWritingNull
            });

        for (var attempt = 0;
             attempt <= _options.MaxRetries;
             attempt++)
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                endpoint);

            request.Headers.TryAddWithoutValidation(
                "x-goog-api-key",
                _options.Gemini.ApiKey);

            request.Content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

            HttpResponseMessage response =
                await _httpClient.SendAsync(
                    request,
                    cancellationToken);

            if (!IsTransient(response.StatusCode)
                || attempt == _options.MaxRetries)
            {
                return response;
            }

            response.Dispose();

            await Task.Delay(
                TimeSpan.FromMilliseconds(300 * (attempt + 1)),
                cancellationToken);
        }

        throw new AiProviderException(
            "Gemini request failed.");
    }

    private static AiResponse ParseTextResponse(
        JsonElement root,
        string model,
        string? requestId)
    {
        if (!root.TryGetProperty("candidates", out JsonElement candidates)
            || candidates.GetArrayLength() == 0)
        {
            throw new AiProviderException(
                "Gemini returned no response candidate.");
        }

        JsonElement candidate = candidates[0];
        JsonElement content = candidate.GetProperty("content");
        JsonElement parts = content.GetProperty("parts");

        string text = string.Join(
            "\n",
            parts.EnumerateArray()
                .Where(part => part.TryGetProperty("text", out _))
                .Select(part => part.GetProperty("text").GetString())
                .Where(value => !string.IsNullOrWhiteSpace(value)));

        if (string.IsNullOrWhiteSpace(text))
        {
            throw new AiProviderException(
                "Gemini returned an empty response.");
        }

        string? finishReason =
            GetOptionalString(candidate, "finishReason");

        AiUsage? usage = ParseUsage(root);

        return new AiResponse(
            text,
            model,
            finishReason,
            usage,
            requestId);
    }

    private static AiGeneratedImage ParseImageResponse(
        JsonElement root)
    {
        if (!root.TryGetProperty("candidates", out JsonElement candidates)
            || candidates.GetArrayLength() == 0)
        {
            throw new AiProviderException(
                "Gemini returned no image candidate.");
        }

        JsonElement parts = candidates[0]
            .GetProperty("content")
            .GetProperty("parts");

        string? description = null;

        foreach (JsonElement part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("text", out JsonElement textElement))
                description = textElement.GetString();

            if (!part.TryGetProperty(
                    "inlineData",
                    out JsonElement inlineData)
                && !part.TryGetProperty(
                    "inline_data",
                    out inlineData))
            {
                continue;
            }

            string? data = GetOptionalString(inlineData, "data");
            string contentType =
                GetOptionalString(inlineData, "mimeType")
                ?? GetOptionalString(inlineData, "mime_type")
                ?? "image/png";

            if (string.IsNullOrWhiteSpace(data))
                continue;

            return new AiGeneratedImage(
                Convert.FromBase64String(data),
                contentType,
                ContentTypeToExtension(contentType),
                description);
        }

        throw new AiProviderException(
            "Gemini did not return generated image data.");
    }

    private static AiUsage? ParseUsage(JsonElement root)
    {
        if (!root.TryGetProperty(
                "usageMetadata",
                out JsonElement usage))
        {
            return null;
        }

        int input = GetOptionalInt(usage, "promptTokenCount");
        int output = GetOptionalInt(usage, "candidatesTokenCount");
        int total = GetOptionalInt(usage, "totalTokenCount");
        int cached = GetOptionalInt(
            usage,
            "cachedContentTokenCount");

        return new AiUsage(
            input,
            output,
            total,
            cached);
    }

    private string BuildModelEndpoint(
        string model,
        string method)
    {
        string cleanModel = model.Trim();

        if (cleanModel.StartsWith(
                "models/",
                StringComparison.OrdinalIgnoreCase))
        {
            cleanModel = cleanModel["models/".Length..];
        }

        return $"{_options.Gemini.BaseUrl.TrimEnd('/')}/{_options.Gemini.ApiVersion.Trim('/')}/models/{Uri.EscapeDataString(cleanModel)}:{method}";
    }

    private CancellationTokenSource CreateTimeoutToken(
        CancellationToken cancellationToken)
    {
        CancellationTokenSource linked =
            CancellationTokenSource.CreateLinkedTokenSource(
                cancellationToken);

        linked.CancelAfter(
            TimeSpan.FromSeconds(
                _options.RequestTimeoutSeconds));

        return linked;
    }

    private void EnsureConfigured(bool requireImageModel)
    {
        if (!_options.Enabled)
        {
            throw new AiConfigurationException(
                "AI integration is disabled.");
        }

        if (string.IsNullOrWhiteSpace(_options.Gemini.ApiKey))
        {
            throw new AiConfigurationException(
                "Gemini API key is not configured.");
        }

        if (string.IsNullOrWhiteSpace(_options.Gemini.Model))
        {
            throw new AiConfigurationException(
                "Gemini chat model is not configured.");
        }

        if (requireImageModel
            && string.IsNullOrWhiteSpace(
                _options.Gemini.ImageModel))
        {
            throw new AiConfigurationException(
                "Gemini image model is not configured.");
        }
    }

    private static void EnsureSuccess(
        HttpResponseMessage response)
    {
        if (response.IsSuccessStatusCode)
            return;

        throw new AiProviderException(
            $"Gemini request failed with status {(int)response.StatusCode}.",
            errorCode: "gemini_http_error",
            statusCode: (int)response.StatusCode,
            isTransient: IsTransient(response.StatusCode));
    }

    private static bool IsTransient(HttpStatusCode statusCode)
    {
        return statusCode is HttpStatusCode.RequestTimeout
            or HttpStatusCode.TooManyRequests
            or HttpStatusCode.BadGateway
            or HttpStatusCode.ServiceUnavailable
            or HttpStatusCode.GatewayTimeout;
    }

    private static string? GetOptionalString(
        JsonElement element,
        string propertyName)
    {
        return element.TryGetProperty(
            propertyName,
            out JsonElement property)
            ? property.GetString()
            : null;
    }

    private static int GetOptionalInt(
        JsonElement element,
        string propertyName)
    {
        return element.TryGetProperty(
                   propertyName,
                   out JsonElement property)
               && property.TryGetInt32(out int value)
            ? value
            : 0;
    }

    private static string ContentTypeToExtension(
        string contentType)
    {
        return contentType.ToLowerInvariant() switch
        {
            "image/jpeg" => ".jpg",
            "image/webp" => ".webp",
            _ => ".png"
        };
    }

    private sealed record GeminiFileReference(
        string Name,
        string Uri,
        string MimeType,
        string? State);
}
