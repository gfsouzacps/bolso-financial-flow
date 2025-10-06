using MediatR;

namespace NoBolso.Application.Features.Auth.Commands;

public class RegistrarUsuarioCommand : IRequest<Guid>
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}
