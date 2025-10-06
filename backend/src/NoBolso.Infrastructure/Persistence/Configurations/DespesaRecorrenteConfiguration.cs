using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class DespesaRecorrenteConfiguration : IEntityTypeConfiguration<DespesaRecorrente>
{
    public void Configure(EntityTypeBuilder<DespesaRecorrente> builder)
    {
        builder.ToTable("DespesasRecorrentes");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Descricao)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(d => d.Valor)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(d => d.Categoria)
            .HasMaxLength(100)
            .IsRequired();

        // Relacionamento com Usuario
        builder.HasOne(d => d.Usuario)
            .WithMany()
            .HasForeignKey(d => d.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
