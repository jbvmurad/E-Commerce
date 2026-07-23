using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Persistance.Configurations.Abstraction;

namespace Profile.Persistance.Configurations.ProfileAttributeConfigurations;

public sealed class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(EntityTypeBuilder<UserAddress> builder)
    {
        builder.ToTable("UserAddresses");
        builder.ConfigureBaseEntity();

        builder.HasIndex(x => x.UserProfileId);

        builder.Property(x => x.UserProfileId).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Title).IsRequired().HasMaxLength(100);
        builder.Property(x => x.RecipientFullName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(50);
        builder.Property(x => x.CountryCode).IsRequired().HasMaxLength(2);
        builder.Property(x => x.City).IsRequired().HasMaxLength(150);
        builder.Property(x => x.StateOrRegion).HasMaxLength(150);
        builder.Property(x => x.District).HasMaxLength(150);
        builder.Property(x => x.AddressLine1).IsRequired().HasMaxLength(500);
        builder.Property(x => x.AddressLine2).HasMaxLength(500);
        builder.Property(x => x.PostalCode).HasMaxLength(30);
    }
}
