using Microsoft.EntityFrameworkCore;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class CarteiraRepository : ICarteiraRepository
{
    private readonly AppDbContext _context;

    public CarteiraRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Carteira?> GetByIdAsync(Guid id)
    {
        return await _context.Carteiras.FindAsync(id);
    }

    public void Add(Carteira carteira)
    {
        _context.Carteiras.Add(carteira);
    }
}
