using MediatR;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;

namespace NoBolso.Application.Features.Auth.Commands;

public class RegistrarUsuarioCommandHandler : IRequestHandler<RegistrarUsuarioCommand, Guid>
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;

    public RegistrarUsuarioCommandHandler(IUsuarioRepository usuarioRepository, IPasswordHasher passwordHasher)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Guid> Handle(RegistrarUsuarioCommand request, CancellationToken cancellationToken)
    {
        // TODO: Adicionar validação com FluentValidation

        var existingUser = await _usuarioRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        { 
            // Idealmente, isso seria um Result<T> com um erro específico,
            // mas por enquanto uma exceção é suficiente.
            throw new Exception("Já existe um usuário com este e-mail.");
        }

        // Hashear a senha
        var passwordHash = _passwordHasher.HashPassword(request.Senha);

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome,
            Email = request.Email,
            PasswordHash = passwordHash
        };

        await _usuarioRepository.AddAsync(usuario);

        return usuario.Id;
    }
}
