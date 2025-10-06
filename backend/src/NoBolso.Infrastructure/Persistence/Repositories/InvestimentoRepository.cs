using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Persistence;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class InvestimentoRepository : IInvestimentoRepository
{
    private readonly AppDbContext _context;

    public InvestimentoRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task AddAsync(Investimento investimento)
    {
        throw new NotImplementedException();
    }

    public Task<Investimento?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
