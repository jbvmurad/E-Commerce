namespace E_Commerce.Server.Shared.AI.Contracts;

public sealed record AiFile(
    string FileName,
    string ContentType,
    long Length,
    Func<Stream> StreamFactory)
{
    public Stream OpenReadStream()
    {
        return StreamFactory();
    }
}
