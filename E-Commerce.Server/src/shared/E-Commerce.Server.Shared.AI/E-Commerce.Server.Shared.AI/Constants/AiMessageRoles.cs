namespace E_Commerce.Server.Shared.AI.Constants;

public static class AiMessageRoles
{
    public const string System = "system";
    public const string User = "user";
    public const string Assistant = "assistant";

    public static IReadOnlyCollection<string> Supported { get; } =
    [
        System,
        User,
        Assistant
    ];

    public static bool IsSupported(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
            return false;

        return Supported.Contains(role, StringComparer.OrdinalIgnoreCase);
    }
}
