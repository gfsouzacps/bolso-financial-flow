using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface ICategoriaInvestimentoRepository
{
    Task AddAsync(CategoriaInvestimento categoriaInvestimento);
    Task<CategoriaInvestimento?> GetByIdAsync(int id);
}
