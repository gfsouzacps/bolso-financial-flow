using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface ICategoriaTransacaoRepository
{
    Task<bool> ExistsAsync(Guid id);
}
