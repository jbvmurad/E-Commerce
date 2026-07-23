using System.Text.Json.Nodes;
using Scalar.AspNetCore;

namespace ApiGateway.Configurations.Extensions;

public static partial class ApplicationBuilderExtensions
{
    private static void MapApiDocumentation(WebApplication app)
    {
        var openApiEnabled = app.Configuration.GetValue<bool>("OpenApi:Enabled");
        if (!openApiEnabled && !app.Environment.IsDevelopment())
            return;

        foreach (var (name, urlKey, gatewayPrefix, servicePrefix) in Services)
        {
            var serviceUrl = app.Configuration[urlKey];
            if (string.IsNullOrWhiteSpace(serviceUrl))
                continue;

            var routeName = name.ToLowerInvariant();
            var upstreamUrl = serviceUrl.TrimEnd('/') + "/openapi/v1.json";
            var gPrefix = gatewayPrefix;
            var sPrefix = servicePrefix;

            app.MapGet($"/openapi/{routeName}.json", async (HttpRequest request, IHttpClientFactory factory) =>
            {
                var client = factory.CreateClient("openapi-proxy");
                try
                {
                    var json = await client.GetStringAsync(upstreamUrl);
                    var doc = JsonNode.Parse(json)!.AsObject();

                    var gatewayBase = $"{request.Scheme}://{request.Host}";
                    doc["servers"] = new JsonArray(
                        new JsonObject { ["url"] = gatewayBase, ["description"] = "API Gateway" }
                    );

                    if (doc["paths"] is JsonObject paths && gPrefix != sPrefix)
                    {
                        var rewritten = new JsonObject();
                        foreach (var (pathKey, pathValue) in paths)
                        {
                            var newKey = pathKey.StartsWith(sPrefix, StringComparison.OrdinalIgnoreCase)
                                ? gPrefix + pathKey[sPrefix.Length..]
                                : pathKey;
                            rewritten[newKey] = pathValue?.DeepClone();
                        }
                        doc["paths"] = rewritten;
                    }

                    return Results.Content(doc.ToJsonString(), "application/json");
                }
                catch
                {
                    return Results.NotFound(new { error = $"{name} service OpenAPI not reachable" });
                }
            }).ExcludeFromDescription();
        }

        app.MapScalarApiReference(options =>
        {
            options.WithTitle("E-Commerce API Gateway");
            options.AddPreferredSecuritySchemes("Bearer");

            foreach (var (name, urlKey, _, _) in Services)
            {
                var serviceUrl = app.Configuration[urlKey];
                if (string.IsNullOrWhiteSpace(serviceUrl))
                    continue;

                options.AddDocument(name, $"/openapi/{name.ToLowerInvariant()}.json");
            }
        });
    }
}
