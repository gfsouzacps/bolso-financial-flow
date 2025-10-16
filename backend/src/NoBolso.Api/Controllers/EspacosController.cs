using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoBolso.Application.Features.EspacosFinanceiros.ConvidarUsuario;

namespace NoBolso.Api.Controllers;

[ApiController]
[Route("api/espacos")]
[Authorize]
public class EspacosController : ControllerBase
{
    private readonly ISender _mediator;

    public EspacosController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("convidar")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ConvidarUsuario([FromBody] ConvidarUsuarioCommand command)
    {
        var success = await _mediator.Send(command);
        if (success)
        {
            return Ok(new { message = "Usuário convidado com sucesso." });
        }

        // Note: Specific errors like 'user not found' will be caught by the ErrorHandlingMiddleware
        // and will not reach this point. This is a fallback.
        return BadRequest(new { message = "Não foi possível convidar o usuário." });
    }
}
