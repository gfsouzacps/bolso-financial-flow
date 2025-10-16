namespace NoBolso.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Chave Estrangeira para o EspacoFinanceiro
    public Guid EspacoFinanceiroId { get; set; }

    // Propriedade de Navegação
    public EspacoFinanceiro EspacoFinanceiro { get; set; } = null!;
}
