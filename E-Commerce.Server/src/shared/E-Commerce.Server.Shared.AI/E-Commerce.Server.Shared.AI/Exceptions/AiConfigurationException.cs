namespace E_Commerce.Server.Shared.AI.Exceptions;

public sealed class AiConfigurationException : Exception
{
    public AiConfigurationException(string message) : base(message) { }

    public AiConfigurationException(string message, Exception innerException) : base(message, innerException) { }
}
