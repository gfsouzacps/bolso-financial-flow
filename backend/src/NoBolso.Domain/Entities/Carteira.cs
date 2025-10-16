namespace NoBolso.Domain.Entities;

public class Carteira
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal SaldoInicial { get; set; }

    // Chave Estrangeira para o espaço compartilhado
    public Guid EspacoFinanceiroId { get; set; }

    // Propriedade de Navegação
    public EspacoFinanceiro EspacoFinanceiro { get; set; } = null!;
}
