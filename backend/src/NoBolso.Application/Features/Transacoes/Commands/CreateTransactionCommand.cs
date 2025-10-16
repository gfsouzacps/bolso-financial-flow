
using MediatR;
using NoBolso.Domain.Enums;

namespace NoBolso.Application.Features.Transacoes.Commands;

public class CreateTransactionCommand : IRequest<Guid>
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
    public TipoTransacao Tipo { get; set; }
    public Guid CarteiraId { get; set; }
    public Guid? CategoriaTransacaoId { get; set; }
}
