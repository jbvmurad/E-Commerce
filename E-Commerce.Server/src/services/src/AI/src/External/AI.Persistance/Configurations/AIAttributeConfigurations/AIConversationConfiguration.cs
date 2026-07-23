using AI.Domain.Entities.AIAttributeEntities;
using AI.Persistance.Configurations.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AI.Persistance.Configurations.AIAttributeConfigurations;

public sealed class AIConversationConfiguration : IEntityTypeConfiguration<AIConversation>
{
    public void Configure(EntityTypeBuilder<AIConversation> builder)
    {
        builder.ToTable("AIConversations");
        builder.ConfigureBaseEntity();

        builder.Property(x => x.UserId).HasMaxLength(100);
        builder.Property(x => x.SessionId).HasMaxLength(150);
        builder.Property(x => x.Title).HasMaxLength(200);
        builder.Property(x => x.ConversationType).IsRequired();
        builder.Property(x => x.IsArchived).IsRequired();

        builder.HasIndex(x => new { x.UserId, x.ConversationType, x.CreatedAt });
        builder.HasIndex(x => new { x.SessionId, x.ConversationType, x.CreatedAt });

        builder.HasMany(x => x.Messages)
            .WithOne(x => x.Conversation)
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
