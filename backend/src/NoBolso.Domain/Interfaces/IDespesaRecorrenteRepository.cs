using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface IDespesaRecorrenteRepository
{
    Task AddAsync(DespesaRecorrente despesaRecorrente);
    Task<DespesaRecorrente?> GetByIdAsync(Guid id);
}
