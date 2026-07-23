namespace E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;

public sealed class ExternalAuthProviderException : Exception
{
    public ExternalAuthProviderException(
        string provider,
        string message,
        string? errorCode = null,
        Exception? innerException = null)
        : base(message, innerException)
    {
        Provider = provider;
        ErrorCode = errorCode;
    }

    public string Provider { get; }

    public string? ErrorCode { get; }
}
