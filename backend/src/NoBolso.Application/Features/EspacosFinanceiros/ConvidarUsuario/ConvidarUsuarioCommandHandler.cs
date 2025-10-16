using MediatR;
using Microsoft.AspNetCore.Http;
using NoBolso.Domain.Interfaces;
using System.Security.Claims;

namespace NoBolso.Application.Features.EspacosFinanceiros.ConvidarUsuario;

public class ConvidarUsuarioCommandHandler : IRequestHandler<ConvidarUsuarioCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ConvidarUsuarioCommandHandler(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(ConvidarUsuarioCommand request, CancellationToken cancellationToken)
    {
        // 1. Get the inviting user (host)
        var hostUserIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(hostUserIdString, out var hostUserId))
        {
            throw new UnauthorizedAccessException("Usuário anfitrião não autenticado ou ID inválido.");
        }

        var hostUser = await _unitOfWork.UsuarioRepository.GetByIdAsync(hostUserId);
        if (hostUser == null)
        {
            throw new ApplicationException("Usuário anfitrião não encontrado.");
        }

        // 2. Get the invited user
        var invitedUser = await _unitOfWork.UsuarioRepository.GetByEmailAsync(request.EmailConvidado);
        if (invitedUser == null)
        {
            throw new ApplicationException("O usuário convidado não foi encontrado.");
        }

        // 3. Update the invited user's financial space
        invitedUser.EspacoFinanceiroId = hostUser.EspacoFinanceiroId;

        // 4. Save changes
        // EF Core change tracking will detect the modification on invitedUser.
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
