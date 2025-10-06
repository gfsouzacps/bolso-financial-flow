using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoBolso.Application;
using NoBolso.Domain.Interfaces;
using NoBolso.Infrastructure.Auth; // Adicionado
using NoBolso.Infrastructure.Persistence;
using NoBolso.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. Configuração do DbContext com PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Injeção de Dependência dos Serviços e Repositórios
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>(); // Adicionado
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<IInvestimentoRepository, InvestimentoRepository>();
builder.Services.AddScoped<IDespesaRecorrenteRepository, DespesaRecorrenteRepository>();
builder.Services.AddScoped<ICategoriaInvestimentoRepository, CategoriaInvestimentoRepository>();

// 3. Configuração do MediatR e FluentValidation
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(AssemblyReference).Assembly));

builder.Services.AddValidatorsFromAssembly(typeof(AssemblyReference).Assembly);
// TODO: Adicionar pipeline de validação para o MediatR

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
