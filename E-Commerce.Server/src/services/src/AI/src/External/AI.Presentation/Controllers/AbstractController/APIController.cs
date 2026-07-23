using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace AI.Presentation.Controllers.AbstractController;

[ApiController]
public abstract class APIController : ControllerBase
{
    protected readonly IMessageBus _bus;

    protected APIController(IMessageBus bus)
    {
        _bus = bus;
    }
}
