namespace NoBolso.Application.Dtos
{
    // DTO para padronizar a resposta
    public record UsuarioDto(Guid Id, string Nome, string Email);
}