using System;
using System.Collections.Generic;

namespace NoBolso.Domain.Entities;

public class UserCachedData
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new List<string>();
    public Dictionary<string, string> Preferences { get; set; } = new Dictionary<string, string>();
}
