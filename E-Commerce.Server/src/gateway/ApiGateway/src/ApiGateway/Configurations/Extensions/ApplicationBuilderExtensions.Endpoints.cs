namespace ApiGateway.Configurations.Extensions;

public static partial class ApplicationBuilderExtensions
{
    private static void MapGatewayEndpoints(WebApplication app)
    {
        app.MapGet("/", () => Results.Ok(new { service = "ApiGateway", status = "ok" }))
            .ExcludeFromDescription();

        app.MapHealthChecks("/health");
    }
}
