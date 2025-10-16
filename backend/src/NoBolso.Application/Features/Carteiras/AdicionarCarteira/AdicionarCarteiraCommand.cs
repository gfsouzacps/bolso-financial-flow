using MediatR;

namespace NoBolso.Application.Features.Carteiras.AdicionarCarteira;

public class AdicionarCarteiraCommand : IRequest<Guid>
{
    public string Nome { get; set; } = string.Empty;
    public decimal SaldoInicial { get; set; }
}
