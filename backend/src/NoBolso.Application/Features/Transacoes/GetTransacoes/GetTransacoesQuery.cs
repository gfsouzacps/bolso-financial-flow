using MediatR;
using NoBolso.Application.Features.Transacoes.Dtos;
using NoBolso.Domain.Enums;

namespace NoBolso.Application.Features.Transacoes.Queries;

public record GetTransacoesQuery(
    DateTime? DataInicio,
    DateTime? DataFim,
    TipoTransacao? Tipo,
    Guid? CarteiraId,
    Guid? UsuarioId // Adicionado para suportar o filtro de usuário do frontend
) : IRequest<IEnumerable<TransacaoDto>>;