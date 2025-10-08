using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace NoBolso.Api.Extensions;

public static class AuthenticationConfigExtensions
{
    public static IServiceCollection AddAuthenticationConfig(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");

        // --- VALIDAÇÃO ADICIONADA ---
        var secret = jwtSettings["Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            // Falha rapidamente com uma mensagem clara se a configuração estiver ausente.
            throw new InvalidOperationException("A chave secreta do JWT (JwtSettings:Secret) não está configurada.");
        }
        var secretKey = Encoding.ASCII.GetBytes(secret);
        // --- FIM DA VALIDAÇÃO ---

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = true; // Sempre true em produção
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                ValidateIssuer = true, // Validação de segurança importante
                ValidIssuer = jwtSettings["Issuer"],
                ValidateAudience = true, // Validação de segurança importante
                ValidAudience = jwtSettings["Audience"],
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // Lê o token do cookie HttpOnly seguro
                    context.Token = context.Request.Cookies["__Host-auth-token"];
                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }
}