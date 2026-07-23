namespace E_Commerce.Server.Shared.Middleware.Middleware;

public sealed class ValidationErrorDetails : ErrorStatusCode
{
    public IDictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>();
}
