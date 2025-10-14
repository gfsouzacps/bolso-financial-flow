using MediatR;
using NoBolso.Application.Dtos;

namespace NoBolso.Application.Features.Auth.Queries
{
    public record GetMeuPerfilQuery : IRequest<UsuarioDto>;
}