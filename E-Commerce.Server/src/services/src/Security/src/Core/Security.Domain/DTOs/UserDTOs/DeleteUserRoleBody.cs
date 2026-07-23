namespace Security.Domain.DTOs.UserDTOs;

public sealed record DeleteUserRoleBody(
    List<string> RoleIds
);
