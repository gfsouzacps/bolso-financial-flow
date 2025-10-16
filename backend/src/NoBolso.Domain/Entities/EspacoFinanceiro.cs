namespace NoBolso.Domain.Entities;

public class EspacoFinanceiro
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    // Propriedade de Navegação: Um espaço pode ter múltiplos usuários
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    // Propriedade de Navegação: Um espaço pode ter múltiplas carteiras
    public ICollection<Carteira> Carteiras { get; set; } = new List<Carteira>();

    // Propriedade de Navegação: Um espaço pode ter múltiplas categorias de transação
    public ICollection<CategoriaTransacao> CategoriasTransacao { get; set; } = new List<CategoriaTransacao>();
}
