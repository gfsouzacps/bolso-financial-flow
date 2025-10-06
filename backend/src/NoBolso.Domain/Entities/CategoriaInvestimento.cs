namespace NoBolso.Domain.Entities;

public class CategoriaInvestimento
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
}
