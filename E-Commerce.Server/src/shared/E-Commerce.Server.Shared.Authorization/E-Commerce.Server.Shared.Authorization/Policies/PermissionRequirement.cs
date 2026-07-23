using Microsoft.AspNetCore.Authorization;

namespace E_Commerce.Server.Shared.Authorization.Policies;

public sealed record PermissionRequirement(string Permission) : IAuthorizationRequirement;
