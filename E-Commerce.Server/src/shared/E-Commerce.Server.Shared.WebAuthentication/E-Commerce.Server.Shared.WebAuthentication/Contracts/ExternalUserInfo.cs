namespace E_Commerce.Server.Shared.ExternalAuthentication.Contracts;

public sealed record ExternalUserInfo(
    string Provider,
    string ProviderUserId,
    string Email,
    bool IsEmailVerified,
    string? FullName = null,
    string? PictureUrl = null);
