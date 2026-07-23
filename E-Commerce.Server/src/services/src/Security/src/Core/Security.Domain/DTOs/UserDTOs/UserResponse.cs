namespace Security.Domain.DTOs.UserDTOs;

public sealed record UserResponse(
    string Id,
    string FullName,
    string? Email,
    string? UserName,
    string? PhoneNumber,
    string? ImageUrl,
    bool EmailConfirmed);
