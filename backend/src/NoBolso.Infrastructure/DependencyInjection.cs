using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Auth;
using NoBolso.Infrastructure.Persistence;
using NoBolso.Infrastructure.Persistence.Repositories;

namespace NoBolso.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddMemoryCache();

        // Outros serviços da camada de infraestrutura podem ser registrados aqui

        return services;
    }
}
