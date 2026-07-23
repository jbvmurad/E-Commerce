using Microsoft.AspNetCore.Mvc;
using Profile.Application.Features.ProfileAttributeFeatures.ProfileFeatures.Commands.UpdateProfile;
using Profile.Application.Services.ProfileAttributeServices;
using Profile.Domain.DTOs.ProfileAttributeDTOs;
using Profile.Domain.DTOs.SystemDTOs;
using Profile.Presentation.Controllers.AbstractController;
using Wolverine;

namespace Profile.Presentation.Controllers.ProfileAttributeControllers;

public sealed class ProfileController : APIController
{
    private readonly IProfileService _profileService;

    public ProfileController(IMessageBus bus, IProfileService profileService) : base(bus)
    {
        _profileService = profileService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ProfileResponse>> GetMe(CancellationToken cancellationToken)
    {
        var profile = await _profileService.GetMyProfileAsync(cancellationToken);
        return Ok(profile);
    }

    [HttpPut("me")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update([FromForm] UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        MessageResponse response = await _bus.InvokeAsync<MessageResponse>(request, cancellationToken);
        return Ok(response);
    }
}
