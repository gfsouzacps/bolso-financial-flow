using FluentValidation;
using Microsoft.AspNetCore.Http;
using NoBolso.Domain.Interfaces;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Transacoes.Commands;

public class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateTransactionCommandValidator(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;

        RuleFor(x => x.Valor)
            .GreaterThan(0).WithMessage("O valor da transação deve ser maior que zero.");

        RuleFor(x => x.CarteiraId)
            .NotEmpty().WithMessage("A carteira é obrigatória.")
            .MustAsync(CarteiraDeveExistirEPertencerAoUsuario).WithMessage("Carteira não encontrada ou você não tem permissão para usá-la.");

        When(x => x.CategoriaTransacaoId.HasValue, () =>
        {
            RuleFor(x => x.CategoriaTransacaoId!.Value) // Use !.Value since we are in a When clause
                .MustAsync(CategoriaDeveExistir).WithMessage("A categoria selecionada não existe.");
        });
    }

    private async Task<bool> CarteiraDeveExistirEPertencerAoUsuario(Guid carteiraId, CancellationToken cancellationToken)
    {
        var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return false; // Not authenticated
        }

        var usuario = await _unitOfWork.UsuarioRepository.GetByIdAsync(userId);
        if (usuario == null)
        {
            return false; // User not found in DB
        }

        var carteira = await _unitOfWork.CarteiraRepository.GetByIdAsync(carteiraId);
        if (carteira == null)
        {
            return false; // Carteira does not exist
        }

        // Validate that the carteira belongs to the user's financial space
        return carteira.EspacoFinanceiroId == usuario.EspacoFinanceiroId;
    }

    private async Task<bool> CategoriaDeveExistir(Guid categoriaId, CancellationToken cancellationToken)
    {
        return await _unitOfWork.CategoriaTransacaoRepository.ExistsAsync(categoriaId);
    }
}
