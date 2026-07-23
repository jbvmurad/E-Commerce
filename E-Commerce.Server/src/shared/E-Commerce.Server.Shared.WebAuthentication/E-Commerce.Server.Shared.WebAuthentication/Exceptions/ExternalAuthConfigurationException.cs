namespace E_Commerce.Server.Shared.ExternalAuthentication.Exceptions;

public sealed class ExternalAuthConfigurationException : Exception
{
    public ExternalAuthConfigurationException(string message)
        : base(message)
    {
    }

    public ExternalAuthConfigurationException(
        string message,
        Exception innerException)
        : base(message, innerException)
    {
    }
}
