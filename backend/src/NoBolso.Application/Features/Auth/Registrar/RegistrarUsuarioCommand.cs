using MediatR;
using System;

namespace NoBolso.Application.Features.Auth.Commands
{
    public record RegistrarUsuarioCommand(string Nome, string Email, string Senha) : IRequest<Guid>;
}