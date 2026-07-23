using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Profile.Presentation.Controllers.AbstractController;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public abstract class APIController : ControllerBase
{
    protected readonly IMessageBus _bus;

    protected APIController(IMessageBus bus)
    {
        _bus = bus;
    }
}
