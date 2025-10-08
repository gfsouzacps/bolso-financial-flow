using MediatR;
using Microsoft.AspNetCore.Http; // Para acessar o usuário da requisição
using NoBolso.Application.Features.Auth.Dtos;
using NoBolso.Application.Features.Auth.Queries;
using NoBolso.Domain.Interfaces;
using System;
using System.Linq; // Adicione esta diretiva
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Auth.Handlers.QuerieHandler
{
    public class GetMeuPerfilQueryHandler : IRequestHandler<GetMeuPerfilQuery, UsuarioDto>
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetMeuPerfilQueryHandler(IUsuarioRepository usuarioRepository, IHttpContextAccessor httpContextAccessor)
        {
            _usuarioRepository = usuarioRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<UsuarioDto> Handle(GetMeuPerfilQuery request, CancellationToken cancellationToken)
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Usuário não autenticado.");
            }

            var usuario = await _usuarioRepository.GetByIdAsync(Guid.Parse(userId));

            if (usuario is null)
            {
                throw new UnauthorizedAccessException("Usuário não encontrado.");
            }

            return new UsuarioDto(usuario.Id, usuario.Nome, usuario.Email);
        }
    }
}