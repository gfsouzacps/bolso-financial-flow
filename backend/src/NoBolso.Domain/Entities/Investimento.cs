namespace NoBolso.Domain.Entities;

public class Investimento
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorInicial { get; set; }
    public decimal ValorAtual { get; set; }
    public DateTime DataInicio { get; set; }

    // Foreign Keys
    public int CategoriaId { get; set; }
    public Guid UsuarioId { get; set; }

    // Navigation Properties
    public CategoriaInvestimento Categoria { get; set; } = null!;
    public Usuario Usuario { get; set; } = null!;
}
