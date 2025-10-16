using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Transacoes.Dtos;

public record TransacaoDto(
 Guid Id,
 string Descricao,
 decimal Valor,
 string Tipo, // "receita" ou "despesa"
 DateTime Data,
 Guid CarteiraId,
 Guid UsuarioId,
 Guid? CategoriaTransacaoId,
 RecorrenciaDto? Recorrencia
);
