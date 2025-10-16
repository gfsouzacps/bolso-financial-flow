using MediatR;
using NoBolso.Application.Common.Exceptions;
using NoBolso.Application.Dtos;
using NoBolso.Application.Features.Auth.Dtos;
using NoBolso.Domain.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace NoBolso.Application.Features.Auth.Autenticar;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginCommandHandler(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var usuario = await _unitOfWork.UsuarioRepository.GetByEmailAsync(request.Email);

        if (usuario is null || !_passwordHasher.VerifyPassword(request.Senha, usuario.PasswordHash))
        {
            throw new BadRequestException("Email ou senha inválidos.");
        }

        // Gera o token JWT corretamente
        var token = _jwtTokenGenerator.GenerateToken(usuario);

        var usuarioDto = new UsuarioDto(usuario.Id, usuario.Nome, usuario.Email);

        return new LoginResponseDto(token, usuarioDto);
    }
}