using MediatR;
using NoBolso.Application.Dtos;

namespace NoBolso.Application.Features.Auth.Commands;
public record LoginCommand(string Email, string Senha) : IRequest<LoginResponseDto>;