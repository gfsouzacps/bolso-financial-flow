using NoBolso.Domain.Entities;
using NoBolso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Domain.Interfaces;

public interface ITransacaoRepository
{
    void Add(Transacao transacao);

    Task<IEnumerable<Transacao>> GetAllByUsuarioIdAsync(
        Guid usuarioId,
        DateTime? dataInicio,
        DateTime? dataFim,
        TipoTransacao? tipo,
        Guid? carteiraId,
        CancellationToken cancellationToken
    );
}
