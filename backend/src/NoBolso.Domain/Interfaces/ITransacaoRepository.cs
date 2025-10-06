using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface ITransacaoRepository
{
    Task AddAsync(Transacao transacao);
    Task<Transacao?> GetByIdAsync(Guid id);
    // Outros métodos de consulta complexa podem ser adicionados aqui
}
