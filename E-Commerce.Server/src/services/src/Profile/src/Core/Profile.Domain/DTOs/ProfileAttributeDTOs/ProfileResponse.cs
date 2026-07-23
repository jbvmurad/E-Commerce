namespace Profile.Domain.DTOs.ProfileAttributeDTOs;

public sealed record ProfileResponse(
    string Id,
    string UserId,
    string FullName,
    string? PhoneNumber,
    string? ImageUrl,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
