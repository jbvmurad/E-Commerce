namespace E_Commerce.Server.Shared.AI.Exceptions;

public sealed class AiProviderException : Exception
{
    public AiProviderException(string message) : base(message) { }

    public AiProviderException(string message, Exception innerException) : base(message, innerException) { }

    public AiProviderException(string message, string? errorCode, int? statusCode, bool isTransient,Exception? innerException = null) : base(message, innerException)
    {
        ErrorCode = errorCode;
        StatusCode = statusCode;
        IsTransient = isTransient;
    }

    public string? ErrorCode { get; }

    public int? StatusCode { get; }

    public bool IsTransient { get; }
}
