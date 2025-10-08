using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using NoBolso.Application.Common.Behaviors; // Importe o namespace
using System.Reflection;

namespace NoBolso.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}