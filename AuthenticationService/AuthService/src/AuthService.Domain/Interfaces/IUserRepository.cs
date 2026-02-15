using System;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email); //puede que venga o no nulo
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailVerifiAsync(string token);
    Task<User?> GetByPassResetTokenAsync(string token);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByUsernameAsync(string username);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(string id);
    
    Task<UserPassReset?> GetPasswordResetAsync(string token);
    Task UpdateUserRoleAsync(string userId, string roleId);
    Task AddPasswordResetAsync(UserPassReset resetEntry);

    
}
