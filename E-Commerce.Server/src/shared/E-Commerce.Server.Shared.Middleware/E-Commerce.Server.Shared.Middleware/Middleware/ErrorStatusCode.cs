using System.Text.Json;

namespace E_Commerce.Server.Shared.Middleware.Middleware;

public class ErrorStatusCode
{
    public int StatusCode { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
