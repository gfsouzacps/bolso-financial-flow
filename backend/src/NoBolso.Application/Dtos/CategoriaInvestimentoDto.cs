using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoBolso.Application.Dtos;
public record CategoriaInvestimentoDto(
    Guid Id,
    string Nome,
    decimal Objetivo,
    decimal ValorAtual
);