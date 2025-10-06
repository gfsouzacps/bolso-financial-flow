using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface IInvestimentoRepository
{
    Task AddAsync(Investimento investimento);
    Task<Investimento?> GetByIdAsync(Guid id);
}
