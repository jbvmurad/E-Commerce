namespace Security.Application.Features.UserAttributeFeatures.UserRoleFeatures.Commands.GiveUserRole;

public sealed record GiveUserRoleCommand(
    string UserId,
    string RoleId) ;
