using Microsoft.EntityFrameworkCore;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Enums;
using NoBolso.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Infrastructure.Persistence.Repositories;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _context;

    public TransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(Transacao transacao)
    {
        _context.Transacoes.Add(transacao);
    }

    public async Task<IEnumerable<Transacao>> GetAllByUsuarioIdAsync(
        Guid usuarioId,
        DateTime? dataInicio,
        DateTime? dataFim,
        TipoTransacao? tipo,
        Guid? carteiraId,
        CancellationToken cancellationToken)
    {
        var query = _context.Transacoes
            .AsNoTracking()
            .Where(t => t.UsuarioId == usuarioId);

        if (dataInicio.HasValue)
        {
            query = query.Where(t => t.Data >= dataInicio.Value);
        }

        if (dataFim.HasValue)
        {
            query = query.Where(t => t.Data <= dataFim.Value);
        }

        if (tipo.HasValue)
        {
            query = query.Where(t => t.Tipo == tipo.Value);
        }

        if (carteiraId.HasValue)
        {
            query = query.Where(t => t.CarteiraId == carteiraId.Value);
        }

        return await query.OrderByDescending(t => t.Data).ToListAsync(cancellationToken);
    }
}
