namespace NoBolso.Application.Features.Auth.Dtos
{
    // DTO para padronizar a resposta
    public record UsuarioDto(Guid Id, string Nome, string Email);
}