using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Forwarder;

namespace ApiGateway.Configurations.Helpers;

internal static partial class GatewayConfigurationHelpers
{
    public static IReadOnlyList<ClusterConfig> GetClusters(
        string securityServiceUrl,
        string profileServiceUrl,
        string aiServiceUrl)
        => new List<ClusterConfig>
        {
            new()
            {
                ClusterId = "security-cluster",
                Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
                {
                    ["destination1"] = new() { Address = securityServiceUrl }
                }
            },
            new()
            {
                ClusterId = "profile-cluster",
                Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
                {
                    ["destination1"] = new() { Address = profileServiceUrl }
                }
            },
            new()
            {
                ClusterId = "ai-cluster",
                Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
                {
                    ["destination1"] = new() { Address = aiServiceUrl }
                },
                HttpRequest = new ForwarderRequestConfig
                {
                    ActivityTimeout = TimeSpan.FromMinutes(10)
                }
            }
        };
}
