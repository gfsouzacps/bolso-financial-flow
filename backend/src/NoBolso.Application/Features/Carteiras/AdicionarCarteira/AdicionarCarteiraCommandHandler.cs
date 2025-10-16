using MediatR;
using Microsoft.AspNetCore.Http;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using System.Security.Claims;

namespace NoBolso.Application.Features.Carteiras.AdicionarCarteira;

public class AdicionarCarteiraCommandHandler : IRequestHandler<AdicionarCarteiraCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AdicionarCarteiraCommandHandler(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Guid> Handle(AdicionarCarteiraCommand request, CancellationToken cancellationToken)
    {
        var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedAccessException("Usuário não autenticado ou ID inválido.");
        }

        var usuario = await _unitOfWork.UsuarioRepository.GetByIdAsync(userId);
        if (usuario == null)
        {
            throw new ApplicationException("Usuário não encontrado.");
        }

        var carteira = new Domain.Entities.Carteira
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome,
            SaldoInicial = request.SaldoInicial,
            EspacoFinanceiroId = usuario.EspacoFinanceiroId
        };

        _unitOfWork.CarteiraRepository.Add(carteira);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return carteira.Id;
    }
}
