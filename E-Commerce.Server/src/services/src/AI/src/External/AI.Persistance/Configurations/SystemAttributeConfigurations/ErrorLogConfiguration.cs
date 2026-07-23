using AI.Domain.Entities.SystemEntities;
using AI.Persistance.Configurations.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI.Persistance.Configurations.SystemAttributeConfigurations;

public sealed class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
{
    public void Configure(EntityTypeBuilder<ErrorLog> builder)
    {
        builder.ToTable("ErrorLogs");
        builder.ConfigureBaseEntity();
        builder.Property(x => x.Message).IsRequired().HasColumnType("text");
        builder.Property(x => x.StackTrace).HasColumnType("text");
        builder.Property(x => x.Path).HasMaxLength(1000);
        builder.Property(x => x.Method).HasMaxLength(20);
    }
}
