using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Security.Presentation.Controllers.AbstractController;


[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public abstract class APIController : ControllerBase
{
    protected readonly IMessageBus _bus;

    protected APIController(IMessageBus bus)
    {
        _bus = bus;
    }
}
