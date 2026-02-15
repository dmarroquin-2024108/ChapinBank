using System;
using System.ComponentModel;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IRoleRepository
{
    Task<Roles?> GetByNameAsync(string roleName);
    Task<int> CountUserRolesAsync(string roleName);
    Task<IReadOnlyList<User>> GetUserByRoleAsync(string roleName);
    Task<IReadOnlyList<string>> GetUserRoleNameAsync(string userId);

}
