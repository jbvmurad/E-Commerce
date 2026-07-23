using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities.Abstraction;

namespace Profile.Persistance.Configurations.Abstraction;

public static class BaseEntityConfigurationExtensions
{
    public static void ConfigureBaseEntity<TEntity>(this EntityTypeBuilder<TEntity> builder)
        where TEntity : BaseEntity
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).IsRequired().HasMaxLength(100);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.UpdatedAt);
    }
}
