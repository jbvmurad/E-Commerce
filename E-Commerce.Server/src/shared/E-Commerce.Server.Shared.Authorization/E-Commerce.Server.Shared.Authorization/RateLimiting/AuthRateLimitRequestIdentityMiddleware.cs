using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Authorization.RateLimiting;

public sealed class AuthRateLimitRequestIdentityMiddleware
{
    private const int MaxBodyBytes = 32 * 1024;
    private readonly RequestDelegate _next;

    private static readonly HashSet<string> BodyIdentityPaths = new(StringComparer.OrdinalIgnoreCase)
    {
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/resend-confirmation",
        "/api/auth/reset-password",
        "/api/auth/createtoken",
        "/api/auth/logout"
    };

    public AuthRateLimitRequestIdentityMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (ShouldReadBody(context))
            await TryReadIdentityFromBodyAsync(context);

        await _next(context);
    }

    private static bool ShouldReadBody(HttpContext context)
    {
        if (!HttpMethods.IsPost(context.Request.Method))
            return false;

        string path = context.Request.Path.Value?.TrimEnd('/') ?? string.Empty;
        if (!BodyIdentityPaths.Contains(path))
            return false;

        if (!context.Request.HasJsonContentType())
            return false;

        if (context.Request.ContentLength > MaxBodyBytes)
            return false;

        return true;
    }

    private static async Task TryReadIdentityFromBodyAsync(HttpContext context)
    {
        try
        {
            context.Request.EnableBuffering(bufferThreshold: 8 * 1024, bufferLimit: MaxBodyBytes);

            if (context.Request.Body.CanSeek)
                context.Request.Body.Position = 0;

            using JsonDocument document = await JsonDocument.ParseAsync(
                context.Request.Body,
                cancellationToken: context.RequestAborted);

            if (TryGetStringProperty(document.RootElement, "email", out string? email) && !string.IsNullOrWhiteSpace(email))
                context.Items[AuthRateLimitHttpContextItems.Email] = email.Trim().ToLowerInvariant();

            if (TryGetStringProperty(document.RootElement, "userId", out string? userId) && !string.IsNullOrWhiteSpace(userId))
                context.Items[AuthRateLimitHttpContextItems.UserId] = userId.Trim();
        }
        catch (JsonException)
        {
        }
        catch (IOException)
        {
        }
        finally
        {
            if (context.Request.Body.CanSeek)
                context.Request.Body.Position = 0;
        }
    }

    private static bool TryGetStringProperty(JsonElement root, string propertyName, out string? value)
    {
        value = null;

        if (root.ValueKind != JsonValueKind.Object)
            return false;

        foreach (JsonProperty property in root.EnumerateObject())
        {
            if (!property.Name.Equals(propertyName, StringComparison.OrdinalIgnoreCase))
                continue;

            value = property.Value.ValueKind == JsonValueKind.String
                ? property.Value.GetString()
                : property.Value.ToString();

            return true;
        }

        return false;
    }
}
