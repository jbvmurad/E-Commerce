namespace E_Commerce.Server.Shared.AI.Exceptions;

public sealed class AiRequestValidationException : Exception
{
    public AiRequestValidationException(
        string message,
        IReadOnlyCollection<string> errors)
        : base(CreateMessage(message, errors))
    {
        Errors = errors;
    }

    public IReadOnlyCollection<string> Errors { get; }

    private static string CreateMessage(
        string message,
        IReadOnlyCollection<string> errors)
    {
        if (errors.Count == 0)
            return message;

        return $"{message} {string.Join("; ", errors)}";
    }
}
