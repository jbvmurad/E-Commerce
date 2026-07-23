using AI.Domain.Entities.Abstraction;

namespace AI.Domain.Entities.SystemEntities;

public sealed class ErrorLog : BaseEntity
{
    public string Message { get; set; }
    public string? StackTrace { get; set; }
    public string? Path { get; set; }
    public string? Method { get; set; }
    public int StatusCode { get; set; }
}
