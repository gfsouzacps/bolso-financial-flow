using MediatR;
using NoBolso.Application.Features.Auth.Dtos;

namespace NoBolso.Application.Features.Auth.GetPerfil
{
    public record GetMeuPerfilQuery : IRequest<UsuarioDto>;
}
