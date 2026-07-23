namespace Profile.Domain.DTOs.ProfileAttributeDTOs;

public sealed record UserAddressResponse(
    string Id,
    string Title,
    string RecipientFullName,
    string PhoneNumber,
    string CountryCode,
    string City,
    string? StateOrRegion,
    string? District,
    string AddressLine1,
    string? AddressLine2,
    string? PostalCode,
    bool IsDefaultShipping,
    bool IsDefaultBilling,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
