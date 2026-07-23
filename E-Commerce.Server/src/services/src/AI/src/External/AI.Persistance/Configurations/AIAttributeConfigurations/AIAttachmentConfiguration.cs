using AI.Domain.Entities.AIAttributeEntities;
using AI.Persistance.Configurations.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI.Persistance.Configurations.AIAttributeConfigurations;

public sealed class AIAttachmentConfiguration : IEntityTypeConfiguration<AIAttachment>
{
    public void Configure(EntityTypeBuilder<AIAttachment> builder)
    {
        builder.ToTable("AIAttachments");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.MessageId).IsRequired().HasMaxLength(100);
        builder.Property(x => x.AttachmentType).IsRequired();
        builder.Property(x => x.Source).IsRequired();
        builder.Property(x => x.FileName).IsRequired().HasMaxLength(512);
        builder.Property(x => x.FileUrl).IsRequired().HasColumnType("text");
        builder.Property(x => x.ContentType).IsRequired().HasMaxLength(150);
        builder.Property(x => x.FileSize).IsRequired();

        builder.HasIndex(x => x.MessageId);
    }
}
