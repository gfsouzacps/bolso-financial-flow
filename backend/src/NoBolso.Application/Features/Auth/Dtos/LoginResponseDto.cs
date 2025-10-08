namespace NoBolso.Application.Features.Auth.Dtos;

public record LoginResponseDto(
    string AccessToken,
    UsuarioDto User
);