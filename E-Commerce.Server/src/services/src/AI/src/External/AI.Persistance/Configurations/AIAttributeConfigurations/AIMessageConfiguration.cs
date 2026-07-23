using AI.Domain.Entities.AIAttributeEntities;
using AI.Persistance.Configurations.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI.Persistance.Configurations.AIAttributeConfigurations;

public sealed class AIMessageConfiguration : IEntityTypeConfiguration<AIMessage>
{
    public void Configure(EntityTypeBuilder<AIMessage> builder)
    {
        builder.ToTable("AIMessages");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.ConversationId).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Role).IsRequired();
        builder.Property(x => x.Content).IsRequired().HasColumnType("text");

        builder.HasIndex(x => new { x.ConversationId, x.CreatedAt });

        builder.HasMany(x => x.Attachments)
            .WithOne(x => x.Message)
            .HasForeignKey(x => x.MessageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
