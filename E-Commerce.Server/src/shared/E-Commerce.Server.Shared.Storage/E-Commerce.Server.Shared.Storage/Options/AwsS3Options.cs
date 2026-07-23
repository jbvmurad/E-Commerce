namespace E_Commerce.Server.Shared.Storage.Options;

public sealed class AwsS3Options
{
    public bool Enabled { get; set; }
    public string BucketName { get; set; } = string.Empty;
    public string Region { get; set; } = "eu-central-1";
    public string? ServiceUrl { get; set; }
    public bool ForcePathStyle { get; set; }
    public string? KeyPrefix { get; set; }
    public bool MakePublic { get; set; } = true;
    public string? PublicBaseUrl { get; set; }
}
