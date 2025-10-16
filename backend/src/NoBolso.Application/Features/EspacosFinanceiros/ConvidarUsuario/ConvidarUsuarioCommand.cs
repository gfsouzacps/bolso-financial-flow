using MediatR;

namespace NoBolso.Application.Features.EspacosFinanceiros.ConvidarUsuario;

public class ConvidarUsuarioCommand : IRequest<bool>
{
    public string EmailConvidado { get; set; } = string.Empty;
}
