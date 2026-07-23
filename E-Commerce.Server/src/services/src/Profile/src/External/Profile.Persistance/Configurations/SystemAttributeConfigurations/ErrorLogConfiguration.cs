using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Profile.Domain.Entities.SystemEntities;
using Profile.Persistance.Configurations.Abstraction;

namespace Profile.Persistance.Configurations.SystemAttributeConfigurations;

public sealed class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
{
    public void Configure(EntityTypeBuilder<ErrorLog> builder)
    {
        builder.ToTable("ErrorLogs");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.Message).IsRequired().HasMaxLength(4000);
        builder.Property(x => x.StackTrace).HasColumnType("text");
        builder.Property(x => x.Path).HasMaxLength(1000);
        builder.Property(x => x.Method).HasMaxLength(20);
    }
}
