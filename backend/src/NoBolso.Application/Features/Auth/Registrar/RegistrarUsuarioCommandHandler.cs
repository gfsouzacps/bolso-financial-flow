using MediatR;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Auth.Registrar
{
    public class RegistrarUsuarioCommandHandler : IRequestHandler<RegistrarUsuarioCommand, Guid>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;

        public RegistrarUsuarioCommandHandler(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }

        public async Task<Guid> Handle(RegistrarUsuarioCommand request, CancellationToken cancellationToken)
        {
            // Verificar se já existe um usuário com o mesmo email
            var existingUser = await _unitOfWork.UsuarioRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new ApplicationException("Já existe um usuário com este email.");
            }

            // 1. Criar o Espaço Financeiro
            var espacoFinanceiro = new NoBolso.Domain.Entities.EspacoFinanceiro
            {
                Id = Guid.NewGuid(),
                Nome = $"Espaço de {request.Nome}"
            };

            // 2. Criar o Usuário e associar ao Espaço
            var passwordHash = _passwordHasher.HashPassword(request.Senha);
            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = request.Nome,
                Email = request.Email,
                PasswordHash = passwordHash,
                EspacoFinanceiroId = espacoFinanceiro.Id
            };

            // 3. Adicionar ambos aos seus repositórios
            _unitOfWork.EspacoFinanceiroRepository.Add(espacoFinanceiro);
            await _unitOfWork.UsuarioRepository.AddAsync(usuario);

            // 4. Salvar tudo em uma única transação
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return usuario.Id;
        }
    }
}