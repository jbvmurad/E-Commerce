namespace AI.Domain.Entities.Abstraction;

public abstract class BaseEntity
{
    public BaseEntity()
    {
        Id = Guid.NewGuid().ToString();
    }

    public string Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
