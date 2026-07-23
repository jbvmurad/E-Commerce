namespace Security.Domain.DTOs.UserDTOs;

public sealed record UserRoleResponse(
    string UserId,
    string UserFullName,
    string? UserEmail,
    string RoleId,
    string? RoleName);
