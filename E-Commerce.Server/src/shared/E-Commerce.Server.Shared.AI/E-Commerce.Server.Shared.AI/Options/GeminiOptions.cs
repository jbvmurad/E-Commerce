using System.Text.Json.Serialization;

namespace E_Commerce.Server.Shared.AI.Options;

public sealed class GeminiOptions
{
    [JsonIgnore]
    public string ApiKey { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public string ImageModel { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://generativelanguage.googleapis.com";

    public string ApiVersion { get; set; } = "v1beta";
}
