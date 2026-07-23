using Security.Domain.Entities.SystemEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Security.Persistance.Configurations.Abstraction;

namespace Security.Persistance.Configurations.SystemAttributeConfigurations;

public sealed class ErrorLogConfiguration : IEntityTypeConfiguration<ErrorLog>
{
    public void Configure(EntityTypeBuilder<ErrorLog> builder)
    {
        builder.ToTable("ErrorLogs");
        builder.ConfigureBaseEntity();
    }
}
