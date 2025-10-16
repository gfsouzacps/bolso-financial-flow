using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoBolso.Domain.Entities;

namespace NoBolso.Infrastructure.Persistence.Configurations;

public class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
{
    public void Configure(EntityTypeBuilder<Transacao> builder)
    {
        builder.ToTable("Transacoes");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Descricao)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(t => t.Valor)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.HasOne(t => t.Usuario)
            .WithMany()
            .HasForeignKey(t => t.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        // Adiciona o relacionamento opcional com Recorrencia (One-to-One)
        builder.HasOne(t => t.Recorrencia)
            .WithOne()
            .HasForeignKey<Recorrencia>(r => r.TransacaoId);
    }
}