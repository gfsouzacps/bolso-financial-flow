using FluentValidation;
using NoBolso.Application.Common.Exceptions;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NoBolso.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError; // 500 if unexpected
        object responsePayload;

        switch (exception)
        {
            case ValidationException validationException:
                code = HttpStatusCode.BadRequest;
                responsePayload = new { 
                    Title = "Um ou mais erros de validação ocorreram.",
                    Status = (int)code,
                    Errors = validationException.Errors.ToDictionary(e => e.PropertyName, e => new[] { e.ErrorMessage })
                };
                break;

            case NotFoundException notFoundException:
                code = HttpStatusCode.NotFound;
                responsePayload = new { Title = notFoundException.Message, Status = (int)code };
                break;

            case BadRequestException badRequestException:
                code = HttpStatusCode.BadRequest;
                responsePayload = new { Title = badRequestException.Message, Status = (int)code };
                break;

            case UnauthorizedAccessException _:
                code = HttpStatusCode.Unauthorized;
                responsePayload = new { Title = "Acesso não autorizado.", Status = (int)code };
                break;

            default:
                // Generic response for other errors to avoid leaking details
                responsePayload = new { 
                    Title = "Ocorreu um erro inesperado no servidor.", 
                    Status = (int)code 
                };
                break;
        }

        var result = JsonSerializer.Serialize(responsePayload, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;
        return context.Response.WriteAsync(result);
    }
}
