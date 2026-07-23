namespace E_Commerce.Server.Shared.Middleware.Middleware;

public sealed class ErrorResult : ErrorStatusCode
{
    public string Message { get; set; }
}
