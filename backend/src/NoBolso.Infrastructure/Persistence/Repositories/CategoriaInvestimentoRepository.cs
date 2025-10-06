using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Persistence;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class CategoriaInvestimentoRepository : ICategoriaInvestimentoRepository
{
    private readonly AppDbContext _context;

    public CategoriaInvestimentoRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task AddAsync(CategoriaInvestimento categoriaInvestimento)
    {
        throw new NotImplementedException();
    }

    public Task<CategoriaInvestimento?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }
}
