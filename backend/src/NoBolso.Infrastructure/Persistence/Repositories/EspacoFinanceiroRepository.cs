using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class EspacoFinanceiroRepository : IEspacoFinanceiroRepository
{
    private readonly AppDbContext _context;

    public EspacoFinanceiroRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(EspacoFinanceiro espacoFinanceiro)
    {
        _context.EspacosFinanceiros.Add(espacoFinanceiro);
    }
}
