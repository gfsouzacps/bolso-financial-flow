namespace NoBolso.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ITransacaoRepository TransacaoRepository { get; }
    ICarteiraRepository CarteiraRepository { get; }
    ICategoriaTransacaoRepository CategoriaTransacaoRepository { get; }
    IUsuarioRepository UsuarioRepository { get; }
    IEspacoFinanceiroRepository EspacoFinanceiroRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
