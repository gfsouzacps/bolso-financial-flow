using MediatR;
using NoBolso.Application.Features.Auth.Dtos;

namespace NoBolso.Application.Features.Auth.Queries
{
    public record GetMeuPerfilQuery : IRequest<UsuarioDto>;
}