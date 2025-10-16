using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface ICarteiraRepository
{
    Task<Carteira?> GetByIdAsync(Guid id);
    void Add(Carteira carteira);
}
