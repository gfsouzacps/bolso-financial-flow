using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Persistence;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _context;

    public TransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task AddAsync(Transacao transacao)
    {
        throw new NotImplementedException();
    }

    public Task<Transacao?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
