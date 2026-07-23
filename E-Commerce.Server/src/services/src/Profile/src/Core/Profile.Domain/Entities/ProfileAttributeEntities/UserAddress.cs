using Profile.Domain.Entities.Abstraction;

namespace Profile.Domain.Entities.ProfileAttributeEntities;

public sealed class UserAddress : BaseEntity
{
    public string UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }

    public string Title { get; set; }
    public string RecipientFullName { get; set; }
    public string PhoneNumber { get; set; }
    public string CountryCode { get; set; }
    public string City { get; set; }
    public string? StateOrRegion { get; set; }
    public string? District { get; set; }
    public string AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? PostalCode { get; set; }
    public bool IsDefaultShipping { get; set; }
    public bool IsDefaultBilling { get; set; }
}
