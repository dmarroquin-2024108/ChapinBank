using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

namespace AuthService.Application.Services;

public class UserManagementService(IUserRepository users, IRoleRepository roles) : IUserManagementService
{
    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        // normalizar 
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;

        // inputs validos
        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Use {RoleConstants.ADMIN_ROLE} or {RoleConstants.USER_ROLE}");

        var user = await users.GetByIdAsync(userId);

        // validar existencia de usuario
        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUserRolesAsync(RoleConstants.ADMIN_ROLE);

            if (adminCount <= 1)
            {
                throw new InvalidOperationException("Cannot remove the last administrator");
            }
        }

        var role = await roles.GetByNameAsync(roleName)
                    ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateUserRoleAsync(userId, role.IdRole);

        user = await users.GetByIdAsync(userId);

        return new UserResponseDto
        {
            IdUserResponse = user.IdUser,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            Role = role.Name,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId)
    {
        var roleNames = await roles.GetUserRoleNameAsync(userId);
        return roleNames;
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUserByRoleAsync(roleName);
        return usersInRole.Select(u => new UserResponseDto
        {
            IdUserResponse = u.IdUser,
            Name = u.Name,
            Surname = u.Surname,
            Username = u.Username,
            Email = u.Email,

            Role = roleName,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

    public async Task<UserSummaryDto> GetUsersSummaryAsync()
    {
        var allUsers = await users.GetAllAsync();
        var recent = allUsers
        .OrderByDescending(u => u.CreatedAt)
        .Take(5)
        .Select(u => new RecentUserDto
        {
            IdUser = u.IdUser,
            Name = u.Name,
            Surname= u.Surname,
            Username= u.Username,
            Email= u.Email,
            Status= u.Status,
            CreatedAt = u.CreatedAt
        }).ToList();

    return new UserSummaryDto
    {
        Total = allUsers.Count,
        Active = allUsers.Count(u => u.Status && !u.IsDeleted),
        Inactive= allUsers.Count(u => !u.Status && !u.IsDeleted),
        RecentUsers = recent
    };
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
{
    var allUsers = await users.GetAllAsync();
    return allUsers
        .OrderByDescending(u => u.CreatedAt)
        .Select(u => new UserResponseDto
        {
            IdUserResponse = u.IdUser,
            Dpi = u.DPI,
            Name = u.Name,
            Surname = u.Surname,
            Username= u.Username,
            Email= u.Email,
            Phone = u.Phone,
            Direction = u.Direction,
            NameWork = u.NameWork,
            IngresosMensuales = u.IngresosMensuales,
            Status= u.Status,
            IsDeleted = u.IsDeleted,
            DeleteAt = u.DeletedAt,
            Role = u.UserRoles.FirstOrDefault()?.Role?.Name ?? "USER_ROLE",
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt= u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
}
}
