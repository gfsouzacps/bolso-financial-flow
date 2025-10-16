using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class EspacoFinanceiroConfiguration : IEntityTypeConfiguration<EspacoFinanceiro>
{
    public void Configure(EntityTypeBuilder<EspacoFinanceiro> builder)
    {
        builder.ToTable("EspacosFinanceiros");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Nome)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasMany(e => e.Usuarios)
            .WithOne(u => u.EspacoFinanceiro)
            .HasForeignKey(u => u.EspacoFinanceiroId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Carteiras)
            .WithOne(c => c.EspacoFinanceiro)
            .HasForeignKey(c => c.EspacoFinanceiroId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.CategoriasTransacao)
            .WithOne(ct => ct.EspacoFinanceiro)
            .HasForeignKey(ct => ct.EspacoFinanceiroId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
