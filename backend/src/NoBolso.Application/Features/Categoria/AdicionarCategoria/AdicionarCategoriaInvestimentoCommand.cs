using MediatR;
using NoBolso.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Categoria.AdicionarCategoria;
public record AdicionarCategoriaInvestimentoCommand(
    string Nome,
    decimal Objetivo
) : IRequest<CategoriaInvestimentoDto>;