using MediatR;
using NoBolso.Application.Dtos;
using NoBolso.Application.Features.Auth.Commands;
using NoBolso.Application.Features.Auth.Dtos;
using NoBolso.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Auth.Handlers.CommandHandler;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponseDto>
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginCommandHandler(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);
        if (usuario is null)
        {
            // Use exceções mais específicas para melhor tratamento no middleware
            throw new UnauthorizedAccessException("Credenciais inválidas.");
        }

        if (!_passwordHasher.VerifyPassword(request.Senha, usuario.PasswordHash))
        {
            throw new UnauthorizedAccessException("Credenciais inválidas.");
        }

        // Gera o token JWT corretamente
        var token = _jwtTokenGenerator.GenerateToken(usuario);

        var usuarioDto = new UsuarioDto(usuario.Id, usuario.Nome, usuario.Email);

        return new LoginResponseDto(token, usuarioDto);
    }
}