using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Security.Domain.Entities.UserEntities;

namespace Security.Persistance.Configurations.UserAttributeConfigurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.Property(u => u.FullName)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(u => u.ImageUrl);
    }
}
