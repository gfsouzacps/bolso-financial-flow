using NoBolso.Domain.Entities;

namespace NoBolso.Domain.Interfaces;

public interface IUsuarioRepository
{
    Task AddAsync(Usuario usuario);
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByIdAsync(Guid id);
}
