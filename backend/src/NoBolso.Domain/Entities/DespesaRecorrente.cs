using NoBolso.Domain.Enums;

namespace NoBolso.Domain.Entities;

public class DespesaRecorrente
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Categoria { get; set; } = string.Empty;
    public FrequenciaDespesa Frequencia { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime? DataFim { get; set; }

    // Foreign Key
    public Guid UsuarioId { get; set; }

    // Navigation Property
    public Usuario Usuario { get; set; } = null!;
}
