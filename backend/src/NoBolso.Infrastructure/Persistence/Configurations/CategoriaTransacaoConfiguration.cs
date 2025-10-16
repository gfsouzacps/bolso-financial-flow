using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class CategoriaTransacaoConfiguration : IEntityTypeConfiguration<CategoriaTransacao>
{
    public void Configure(EntityTypeBuilder<CategoriaTransacao> builder)
    {
        builder.ToTable("CategoriasTransacao");

        builder.HasKey(ct => ct.Id);

        builder.Property(ct => ct.Nome)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(ct => ct.Cor)
            .HasMaxLength(50);

        builder.Property(ct => ct.Tipo)
            .HasConversion<string>()
            .HasMaxLength(50);
    }
}
