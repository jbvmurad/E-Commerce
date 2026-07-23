namespace Security.Domain.Entities.Abstraction;

public abstract class BaseEntity 
{
    public string Id { get; set; }
    public BaseEntity()
    {
        Id = Guid.NewGuid().ToString();
    }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } 
}
