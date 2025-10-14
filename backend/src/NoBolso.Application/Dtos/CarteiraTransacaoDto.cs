using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoBolso.Application.Dtos;
public record CategoriaTransacaoDto(
    Guid Id,
    string Nome,
    string Tipo // "receita", "despesa", "ambos"
);