using MediatR;
using Microsoft.AspNetCore.Mvc;
using NoBolso.Application.Features.Auth.Commands;

namespace NoBolso.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _mediator;

    public AuthController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] RegistrarUsuarioCommand command)
    {
        try
        {
            var usuarioId = await _mediator.Send(command);
            return Ok(new { UsuarioId = usuarioId });
        }
        catch (Exception ex)
        {
            // Idealmente, teríamos um middleware de tratamento de exceções
            // para capturar diferentes tipos de exceção e retornar os status codes corretos.
            return BadRequest(new { Error = ex.Message });
        }
    }
}
