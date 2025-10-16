using NoBolso.Domain.Enums;

namespace NoBolso.Domain.Entities;

public class Transacao
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
    public TipoTransacao Tipo { get; set; }

    // Chaves Estrangeiras
    public Guid UsuarioId { get; set; }
    public Guid CarteiraId { get; set; } // Adicionado
    public Guid? CategoriaTransacaoId { get; set; } // Adicionado

    // Propriedades de Navegação
    public Usuario Usuario { get; set; } = null!;
    // Adicionar navegação para Carteira e CategoriaTransacao se necessário
    public Recorrencia? Recorrencia { get; set; } // Adicionado
}

public class Recorrencia
{
    public Guid Id { get; set; }
    public string Tipo { get; set; } = string.Empty; // monthly, weekly, etc.
    public DateTime? DataFim { get; set; }
    public bool? EInfinito { get; set; }

    // Chave Estrangeira para Transacao
    public Guid TransacaoId { get; set; }
}