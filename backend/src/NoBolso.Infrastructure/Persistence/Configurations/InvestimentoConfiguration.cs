using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class InvestimentoConfiguration : IEntityTypeConfiguration<Investimento>
{
    public void Configure(EntityTypeBuilder<Investimento> builder)
    {
        builder.ToTable("Investimentos");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Nome)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(i => i.ValorInicial)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(i => i.ValorAtual)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        // Relacionamento com Usuario
        builder.HasOne(i => i.Usuario)
            .WithMany()
            .HasForeignKey(i => i.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relacionamento com CategoriaInvestimento
        builder.HasOne(i => i.Categoria)
            .WithMany()
            .HasForeignKey(i => i.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict); // Não deletar categoria se houver investimentos nela
    }
}
