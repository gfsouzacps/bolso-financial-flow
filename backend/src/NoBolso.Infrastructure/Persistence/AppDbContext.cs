using Microsoft.EntityFrameworkCore;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Transacao> Transacoes { get; set; }
    public DbSet<Investimento> Investimentos { get; set; }
    public DbSet<CategoriaInvestimento> CategoriasInvestimentos { get; set; }
    public DbSet<DespesaRecorrente> DespesasRecorrentes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplica todas as configurações de entidade que estão neste assembly
        // (Procurará por classes que implementam IEntityTypeConfiguration<TEntity>)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
