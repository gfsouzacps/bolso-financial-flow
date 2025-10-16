using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoBolso.Application.Features.Carteiras.AdicionarCarteira;
using System.Net.Mime;

namespace NoBolso.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CarteirasController : ControllerBase
{
    private readonly ISender _mediator;

    public CarteirasController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AdicionarCarteira([FromBody] AdicionarCarteiraCommand command)
    {
        var carteiraId = await _mediator.Send(command);
        return StatusCode(StatusCodes.Status201Created, new { Id = carteiraId });
    }
}
