using MediatR;
using Microsoft.AspNetCore.Http;
using NoBolso.Application.Features.Transacoes.Dtos;
using NoBolso.Domain.Interfaces;
using System.Security.Claims;

namespace NoBolso.Application.Features.Transacoes.Queries;

public class GetTransacoesQueryHandler : IRequestHandler<GetTransacoesQuery, IEnumerable<TransacaoDto>>
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetTransacoesQueryHandler(ITransacaoRepository transacaoRepository, IHttpContextAccessor httpContextAccessor)
    {
        _transacaoRepository = transacaoRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IEnumerable<TransacaoDto>> Handle(GetTransacoesQuery request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var usuarioAutenticadoId))
        {
            throw new UnauthorizedAccessException("Usuário não autenticado.");
        }

        var transacoes = await _transacaoRepository.GetAllByUsuarioIdAsync(
            usuarioAutenticadoId,
            request.DataInicio,
            request.DataFim,
            request.Tipo,
            request.CarteiraId,
            cancellationToken
        );

        return transacoes.Select(t => new TransacaoDto(
            t.Id,
            t.Descricao,
            t.Valor,
            t.Tipo.ToString().ToLower(),
            t.Data,
            t.CarteiraId,
            t.UsuarioId,
            t.CategoriaTransacaoId,
            t.Recorrencia != null ? new RecorrenciaDto(
                t.Recorrencia.Tipo,
                t.Recorrencia.DataFim,
                t.Recorrencia.EInfinito ?? false
            ) : null
        ));
    }
}