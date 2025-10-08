using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NoBolso.Domain.Entities;
using NoBolso.Domain.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NoBolso.Infrastructure.Auth;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Usuario usuario)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret n�o est� configurado."));

        // 1. Tenta ler a chave correta "ExpiryInMinutes"
        if (!int.TryParse(jwtSettings["ExpiryInMinutes"], out int expiryMinutes) || expiryMinutes <= 0)
        {
            // Define um padr�o seguro de 60 minutos (1 hora)
            expiryMinutes = 60;
        }

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),

            // 2. Usa AddMinutes para adicionar o tempo de expira��o corretamente
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),

            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}