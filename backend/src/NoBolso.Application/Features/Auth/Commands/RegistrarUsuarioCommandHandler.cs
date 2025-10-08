using MediatR;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Auth.Commands
{
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
            // Verificar se já existe um usuário com o mesmo email
            var existingUser = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new ApplicationException("Já existe um usuário com este email.");
            }

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
}