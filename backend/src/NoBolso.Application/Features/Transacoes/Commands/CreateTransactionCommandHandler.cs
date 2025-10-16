using MediatR;
using Microsoft.AspNetCore.Http;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Transacoes.Commands;

public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateTransactionCommandHandler(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedAccessException("Usuário não autenticado ou ID inválido.");
        }

        var transacao = new Domain.Entities.Transacao
        {
            Id = Guid.NewGuid(),
            Descricao = request.Descricao,
            Valor = request.Valor,
            Data = request.Data,
            Tipo = request.Tipo,
            CarteiraId = request.CarteiraId,
            CategoriaTransacaoId = request.CategoriaTransacaoId,
            UsuarioId = userId
        };

        _unitOfWork.TransacaoRepository.Add(transacao);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return transacao.Id;
    }
}
