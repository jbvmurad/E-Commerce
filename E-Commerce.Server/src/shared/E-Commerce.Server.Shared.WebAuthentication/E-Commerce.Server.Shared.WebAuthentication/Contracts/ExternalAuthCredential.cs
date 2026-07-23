namespace E_Commerce.Server.Shared.ExternalAuthentication.Contracts;

public sealed record ExternalAuthCredential(
    string Value,
    string? RedirectUri = null);
