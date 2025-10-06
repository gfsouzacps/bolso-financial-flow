using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Persistence;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class DespesaRecorrenteRepository : IDespesaRecorrenteRepository
{
    private readonly AppDbContext _context;

    public DespesaRecorrenteRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task AddAsync(DespesaRecorrente despesaRecorrente)
    {
        throw new NotImplementedException();
    }

    public Task<DespesaRecorrente?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
