using NoBolso.Domain.Enums;

namespace NoBolso.Domain.Entities;

public class CategoriaTransacao
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public TipoTransacaoAplicavel Tipo { get; set; } // Enum para "Receita", "Despesa" ou "Ambos"
    public string Cor { get; set; } = string.Empty; // Ex: "bg-red-500"

    // Chave Estrangeira para o espaço compartilhado
    public Guid EspacoFinanceiroId { get; set; }

    // Propriedade de Navegação
    public EspacoFinanceiro EspacoFinanceiro { get; set; } = null!;
}
