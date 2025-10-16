using MediatR;
using System;

namespace NoBolso.Application.Features.Auth.Registrar
{
    public record RegistrarUsuarioCommand(string Nome, string Email, string Senha) : IRequest<Guid>;
}