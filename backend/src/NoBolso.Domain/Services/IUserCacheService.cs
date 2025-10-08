using NoBolso.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace NoBolso.Domain.Services;

public interface IUserCacheService
{
    Task<UserCachedData?> GetUserCachedDataAsync(Guid userId);
    Task SetUserCachedDataAsync(Guid userId, UserCachedData data);
    Task InvalidateUserCacheAsync(Guid userId);
}
