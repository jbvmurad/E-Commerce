using Microsoft.AspNetCore.Http;

namespace Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;

public sealed record UpdateProfileCommand(
    string? FullName,
    string? PhoneNumber,
    IFormFile? Image,
    bool RemoveImage = false);
