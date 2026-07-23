namespace Security.Domain.DTOs.UserDTOs;

public static class ExternalLoginStatuses
{
    public const string Authenticated = "Authenticated";
    public const string RegistrationRequired = "RegistrationRequired";
    public const string AccountExists = "AccountExists";
}

public sealed record ExternalLoginCommandResponse(
    string Status,
    string? Token,
    string? RefreshToken,
    DateTime? RefreshTokenExpires,
    string? UserId,
    string? FullName,
    string? Email);
