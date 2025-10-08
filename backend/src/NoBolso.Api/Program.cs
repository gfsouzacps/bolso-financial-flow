using NoBolso.Application;
using NoBolso.Infrastructure;
using NoBolso.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddHttpContextAccessor();

// Add API Layer services
builder.Services.AddAuthenticationConfig(builder.Configuration);
builder.Services.AddSwaggerConfig();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp",
        policy => policy.WithOrigins("http://localhost:8080")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;

        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwaggerConfig();

app.UseHttpsRedirection();

app.UseCors("AllowWebApp");

// Adiciona o middleware de autenticação. Deve vir antes da autorização.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();