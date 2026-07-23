namespace E_Commerce.Server.Shared.ExternalAuthentication.Constants;

public static class ExternalAuthProviderNames
{
    public const string Google = "Google";
    public const string Facebook = "Facebook";
    public const string LinkedIn = "LinkedIn";
    public const string Microsoft = "Microsoft";

    public static IReadOnlyCollection<string> KnownProviders { get; } =
    [
        Google,
        Facebook,
        LinkedIn,
        Microsoft
    ];
}
