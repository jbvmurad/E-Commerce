using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities.ProfileAttributeEntities;
using Profile.Persistance.Configurations.Abstraction;

namespace Profile.Persistance.Configurations.ProfileAttributeConfigurations;

public sealed class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("Profiles");
        builder.ConfigureBaseEntity();

        builder.HasIndex(x => x.UserId).IsUnique();

        builder.Property(x => x.UserId).IsRequired().HasMaxLength(100);
        builder.Property(x => x.FullName).IsRequired().HasMaxLength(200);
        builder.Property(x => x.PhoneNumber).HasMaxLength(50);
        builder.Property(x => x.ImageUrl).HasMaxLength(1000);

        builder.HasMany(x => x.Addresses)
            .WithOne(x => x.UserProfile)
            .HasForeignKey(x => x.UserProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
