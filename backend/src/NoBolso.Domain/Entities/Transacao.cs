using NoBolso.Domain.Enums;

namespace NoBolso.Domain.Entities;

public class Transacao
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
    public TipoTransacao Tipo { get; set; }
    public string? Categoria { get; set; }

    // Foreign Key
    public Guid UsuarioId { get; set; }

    // Navigation Property
    public Usuario Usuario { get; set; } = null!;
}
