using NoBolso.Domain.Entities;
using System;

namespace NoBolso.Domain.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Usuario usuario);
}
