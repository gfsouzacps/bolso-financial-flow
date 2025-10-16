using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoBolso.Application.Features.Transacoes.Commands;
using NoBolso.Application.Features.Transacoes.Dtos;
using NoBolso.Application.Features.Transacoes.Queries;
using System.Net.Mime;

namespace NoBolso.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransacoesController : ControllerBase
{
    private readonly ISender _mediator;

    public TransacoesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(IEnumerable<TransacaoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTransacoes([FromQuery] GetTransacoesQuery query)
    {
        var transacoes = await _mediator.Send(query);
        return Ok(transacoes);
    }

    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionCommand command)
    {
        var transacaoId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetTransacoes), new { id = transacaoId }, transacaoId);
    }
}