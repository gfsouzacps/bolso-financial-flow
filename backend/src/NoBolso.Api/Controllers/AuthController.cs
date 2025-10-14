using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoBolso.Application.Dtos;
using NoBolso.Application.Features.Auth.Commands;
using NoBolso.Application.Features.Auth.Queries;
using System.Security.Claims;
// using NoBolso.Application.Features.Auth.Queries; // Adicionaremos este

namespace NoBolso.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _mediator;
    private readonly IConfiguration _configuration;

    public AuthController(ISender mediator, IConfiguration configuration)
    {
        _mediator = mediator;
        _configuration = configuration;
    }
    [Authorize]
    [HttpGet("meu-perfil")]
    public async Task<IActionResult> GetMeuPerfil()
    {
        // Delega toda a lógica para o MediatR
        var usuarioDto = await _mediator.Send(new GetMeuPerfilQuery());
        return Ok(usuarioDto);
    }

    [HttpPost("registrar")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Registrar([FromBody] RegistrarUsuarioCommand command)
    {
        // Com o ValidationBehavior, a validação é automática.
        // Se a validação falhar, uma ValidationException será lançada e tratada pelo middleware global.
        var usuarioId = await _mediator.Send(command);
        return StatusCode(201, new { UsuarioId = usuarioId });
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(UsuarioDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var loginResult = await _mediator.Send(command);

        var expiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryInMinutes", 120); // Default de 2h
        Response.Cookies.Append("__Host-auth-token", loginResult.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Lembre-se que em produção o ambiente deve ser HTTPS
            Expires = DateTimeOffset.UtcNow.AddMinutes(expiryMinutes),
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        // Retorna os dados do usuário no corpo da resposta
        return Ok(loginResult.User);
    }

    [Authorize] // Protegido!
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("__Host-auth-token", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { message = "Logout bem-sucedido." });
    }
}