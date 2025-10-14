using MediatR;
using NoBolso.Application.Features.Transacao.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Transacao.Commands;
public record AdicionarTransacaoCommand(
    string Descricao,
    decimal Valor,
    string Tipo,
    DateTime Data,
    Guid CarteiraId,
    Guid CategoriaTransacaoId,
    RecorrenciaDto? Recorrencia
) : IRequest<TransacaoDto>;