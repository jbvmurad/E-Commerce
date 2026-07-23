namespace Profile.Application.Features.ProfileAttributeFeatures.UserAddressFeatures.Commands.UpdateUserAddress;

public sealed record UpdateUserAddressCommand(
    string Id,
    string Title,
    string RecipientFullName,
    string PhoneNumber,
    string CountryCode,
    string City,
    string AddressLine1,
    string? StateOrRegion = null,
    string? District = null,
    string? AddressLine2 = null,
    string? PostalCode = null,
    bool IsDefaultShipping = false,
    bool IsDefaultBilling = false);
