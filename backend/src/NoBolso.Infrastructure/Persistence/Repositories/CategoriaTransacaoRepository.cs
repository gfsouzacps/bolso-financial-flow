using Microsoft.EntityFrameworkCore;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class CategoriaTransacaoRepository : ICategoriaTransacaoRepository
{
    private readonly AppDbContext _context;

    public CategoriaTransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.CategoriasTransacao.AnyAsync(c => c.Id == id);
    }
}
