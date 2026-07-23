using GenericRepository;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Security.Domain.Entities.Abstraction;
using Security.Domain.Entities.UserEntities;

namespace Security.Persistance.Context;

public sealed class SecurityContext :IdentityDbContext<User,Role,string>,IUnitOfWork
{
    public SecurityContext(DbContextOptions options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
        base.OnModelCreating(modelbuilder);
        modelbuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);

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
