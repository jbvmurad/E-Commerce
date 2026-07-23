using E_Commerce.Server.Shared.AI.Constants;

namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiMessage(
    string Role,
    string Content)
{
    public static AiMessage System(string content)
        => new(AiMessageRoles.System, content);

    public static AiMessage User(string content)
        => new(AiMessageRoles.User, content);

    public static AiMessage Assistant(string content)
        => new(AiMessageRoles.Assistant, content);
}
