using E_Commerce.Server.Shared.Localization.Localizations;
using FluentValidation;

using Microsoft.AspNetCore.Http;

namespace E_Commerce.Server.Shared.Middleware.Middleware;

public sealed class ExceptionMiddleware : IMiddleware
{
    private readonly Func<HttpContext, Exception, HttpRequest, Task> _logAction;
    private readonly Func<HttpContext, Exception, string> _messageResolver;
    private readonly ILocalizationService _localization;

    public ExceptionMiddleware(
        ILocalizationService localizationService = null,
        Func<HttpContext, Exception, HttpRequest, Task> logAction = null,
        Func<HttpContext, Exception, string> messageResolver = null)
    {
        _localization = localizationService;
        _logAction = logAction ?? DefaultLogAction;
        _messageResolver = messageResolver ?? ResolveMessage;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await _logAction(context, ex, context.Request);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";

        var statusCode = ex switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            ArgumentException => StatusCodes.Status400BadRequest,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            KeyNotFoundException => StatusCodes.Status404NotFound,
            HttpRequestException => StatusCodes.Status502BadGateway,
            _ => StatusCodes.Status500InternalServerError
        };

        context.Response.StatusCode = statusCode;

        if (ex is ValidationException vex)
        {
            var errors = vex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            return context.Response.WriteAsJsonAsync(new ValidationErrorDetails
            {
                Errors = errors,
                StatusCode = statusCode
            });
        }

        return context.Response.WriteAsJsonAsync(new ErrorResult
        {
            StatusCode = statusCode,
            Message = _messageResolver(context, ex)
        });
    }

    private string ResolveMessage(HttpContext context, Exception ex)
    {
        var isDevelopment = string.Equals(
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
            "Development",
            StringComparison.OrdinalIgnoreCase);

        if (isDevelopment)
            return ex.Message;

        if (_localization is not null)
            return _localization.Get("Error.Unknown");

        return "Gözlənilməz xəta baş verdi.";
    }

    private static Task DefaultLogAction(HttpContext context, Exception ex, HttpRequest request)
        => Task.CompletedTask;
}
