using System;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;
//interfaz define el que y con que - esta clase define el como
public class RoleRepository(ApplicationDbContext context) : IRoleRepository
{
    public async Task<int> CountUserRolesAsync(string roleName)
    {
        return await context.UserRoles.Include(ur => ur.Role)
            .Where(ur => ur.Role.Name == roleName)
            .Select(ur => ur.UserId)
            .Distinct()
            .CountAsync();
    }

    public async Task<Roles?> GetByNameAsync(string roleName)
    {
        return await context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
    }

    public async Task<IReadOnlyList<string>> GetUserRoleNameAsync(string userId)
    {
        return await context.UserRoles.Include(ur => ur.Role)
            .Where(ur => ur.UserId == userId).Select(ur => ur.Role.Name).ToListAsync();
    }

    public async Task<IReadOnlyList<User>> GetUserByRoleAsync(string roleName)
    {
        var users = await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .Where(u => u.UserRoles.Any(ur => ur.Role.Name == roleName))
            .ToListAsync();
            return users;
    }

}
