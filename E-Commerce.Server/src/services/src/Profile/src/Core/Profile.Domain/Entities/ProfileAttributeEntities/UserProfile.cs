using Profile.Domain.Entities.Abstraction;

namespace Profile.Domain.Entities.ProfileAttributeEntities;

public sealed class UserProfile : BaseEntity
{
    public string UserId { get; set; }
    public string FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<UserAddress> Addresses { get; set; }
        = new List<UserAddress>();
}
