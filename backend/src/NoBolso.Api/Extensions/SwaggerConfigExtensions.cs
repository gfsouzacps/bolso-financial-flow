using System.Reflection;
using Microsoft.OpenApi.Models;
using System.IO;

namespace NoBolso.Api.Extensions;

public static class SwaggerConfigExtensions
{
    public static IServiceCollection AddSwaggerConfig(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "NoBolso API",
                Description = "Documentação da API para gerenciar suas finanças.",
                Contact = new OpenApiContact
                {
                    Name = "NoBolso Team",
                    Url = new Uri("https://github.com/your-repo") // TODO: Atualizar com o link do seu repositório
                }
            });

            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });
        return services;
    }

    public static WebApplication UseSwaggerConfig(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();

            app.UseReDoc(options =>
            {
                options.DocumentTitle = "Documentação NoBolso API";
                options.SpecUrl = "/swagger/v1/swagger.json";
                options.RoutePrefix = "docs";
            });
        }

        return app;
    }
}