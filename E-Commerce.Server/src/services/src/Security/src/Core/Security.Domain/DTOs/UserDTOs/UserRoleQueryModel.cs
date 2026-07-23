namespace Security.Domain.DTOs.UserDTOs;

public sealed class UserRoleQueryModel
{
    public string UserId { get; init; } = string.Empty;
    public string UserFullName { get; init; } = string.Empty;
    public string? UserEmail { get; init; }
    public string RoleId { get; init; } = string.Empty;
    public string? RoleName { get; init; }
}
