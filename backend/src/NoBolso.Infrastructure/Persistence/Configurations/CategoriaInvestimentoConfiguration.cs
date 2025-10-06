using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class CategoriaInvestimentoConfiguration : IEntityTypeConfiguration<CategoriaInvestimento>
{
    public void Configure(EntityTypeBuilder<CategoriaInvestimento> builder)
    {
        builder.ToTable("CategoriasInvestimentos");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nome)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.Descricao)
            .HasMaxLength(255);
    }
}
