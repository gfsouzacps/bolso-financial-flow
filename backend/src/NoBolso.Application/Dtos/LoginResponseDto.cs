namespace NoBolso.Application.Dtos;

public record LoginResponseDto(
    string AccessToken,
    UsuarioDto User
);