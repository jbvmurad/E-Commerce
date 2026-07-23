using Yarp.ReverseProxy.Configuration;

namespace ApiGateway.Configurations.Helpers;

internal static partial class GatewayConfigurationHelpers
{
    public static IReadOnlyList<RouteConfig> GetRoutes()
        => new List<RouteConfig>
        {
            new()
            {
                RouteId = "security-route",
                ClusterId = "security-cluster",
                Match = new RouteMatch { Path = "/api/security/{**catch-all}" },
                Transforms = new List<IReadOnlyDictionary<string, string>>
                {
                    new Dictionary<string, string> { ["PathPattern"] = "/api/{**catch-all}" },
                    new Dictionary<string, string> { ["RequestHeadersCopy"] = "true" },
                    new Dictionary<string, string> { ["RequestHeaderRemove"] = "X-Forwarded-For" }
                }
            },
            new()
            {
                RouteId = "profile-route",
                ClusterId = "profile-cluster",
                Match = new RouteMatch { Path = "/api/profile/{**catch-all}" },
                Transforms = new List<IReadOnlyDictionary<string, string>>
                {
                    new Dictionary<string, string> { ["PathPattern"] = "/api/profile/{**catch-all}" },
                    new Dictionary<string, string> { ["RequestHeadersCopy"] = "true" }
                }
            },
            new()
            {
                RouteId = "ai-route",
                ClusterId = "ai-cluster",
                Match = new RouteMatch { Path = "/api/ai/{**catch-all}" },
                Transforms = new List<IReadOnlyDictionary<string, string>>
                {
                    new Dictionary<string, string> { ["PathPattern"] = "/api/ai/{**catch-all}" },
                    new Dictionary<string, string> { ["RequestHeadersCopy"] = "true" }
                }
            }
        };
}
