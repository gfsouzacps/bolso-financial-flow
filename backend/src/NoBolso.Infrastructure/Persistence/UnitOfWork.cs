using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Persistence.Repositories;

namespace NoBolso.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    public ITransacaoRepository TransacaoRepository { get; }
    public ICarteiraRepository CarteiraRepository { get; }
    public ICategoriaTransacaoRepository CategoriaTransacaoRepository { get; }
    public IUsuarioRepository UsuarioRepository { get; }
    public IEspacoFinanceiroRepository EspacoFinanceiroRepository { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        TransacaoRepository = new TransacaoRepository(_context);
        CarteiraRepository = new CarteiraRepository(_context);
        CategoriaTransacaoRepository = new CategoriaTransacaoRepository(_context);
        UsuarioRepository = new UsuarioRepository(_context);
        EspacoFinanceiroRepository = new EspacoFinanceiroRepository(_context);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
