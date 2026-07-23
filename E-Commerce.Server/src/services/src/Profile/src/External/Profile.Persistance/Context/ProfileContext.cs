using GenericRepository;
using Microsoft.EntityFrameworkCore;
using Profile.Domain.Entities.Abstraction;

namespace Profile.Persistance.Context;

public sealed class ProfileContext : DbContext, IUnitOfWork
{
    public ProfileContext(DbContextOptions options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entities = ChangeTracker.Entries<BaseEntity>();
        foreach (var entity in entities)
        {
            if (entity.State == EntityState.Added)
            {
                entity.Property(x => x.CreatedAt)
                    .CurrentValue = DateTime.UtcNow;
            }

            if (entity.State == EntityState.Modified)
            {
                entity.Property(x => x.UpdatedAt)
                    .CurrentValue = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
