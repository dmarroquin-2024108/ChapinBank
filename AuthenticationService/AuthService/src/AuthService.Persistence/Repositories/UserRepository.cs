using System;
using AuthService.Application.Services;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class UserRepository (ApplicationDbContext context) : IUserRepository
{
    public async Task<User> GetByIdAsync(string id)
    {
        var user = await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserPasswordReset)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.IdUser == id);
        return user ?? throw new InvalidOperationException($"User with id {id} not found.");
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserPasswordReset)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, email));
            
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserPasswordReset)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Username, username));
    }

    public async Task<User?> GetByEmailVerifiAsync(string token)
    {
        return await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserPasswordReset)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.UserEmail != null &&
                                    u.UserEmail.EmailVerificationToken == token &&
                                    u.UserEmail.EmailVerificationTokenExpiry > DateTime.UtcNow);
    }

    public async Task<User?> GetByPassResetTokenAsync(string token)
    {
        return await context.Users
            .Include(u => u.UserEmail)
            .Include(u => u.UserPasswordReset)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.UserPasswordReset != null &&
                                    u.UserPasswordReset.PasswordResetToken == token &&
                                    u.UserPasswordReset.PasswordTokenExpiry > DateTime.UtcNow);
    }

    public async Task<User> CreateAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.IdUser);
    }

    public async Task<User> UpdateAsync(User user)
    {
        try
        {
            context.Users.Update(user);
            await context.SaveChangesAsync();
            return await GetByIdAsync(user.IdUser);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new InvalidOperationException("El usuario no existe o no se pudo actualizar");
        }
        
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await GetByIdAsync(id);
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await context.Users
            .AnyAsync(u => EF.Functions.ILike(u.Email, email));
    }

    public async Task<bool> ExistsByUsernameAsync(string username)
    {
        return await context.Users
            .AnyAsync(u => EF.Functions.ILike(u.Username, username));
    }

    public async Task AddPasswordResetAsync(UserPassReset resetEntry)
    {
        context.UserPasswordResets.Add(resetEntry);
        await context.SaveChangesAsync();
    }


    public async Task UpdateUserRoleAsync(string userId, string roleId)
    {
        // Remove existing user-role associations
        var existingRoles = await context.UserRoles
            .Where(ur => ur.UserId == userId)
            .ToListAsync();
        
        context.UserRoles.RemoveRange(existingRoles);

        // Add new user-role association with the existing role
        var newUserRole = new UserRole
        {
            IdUserRole = IdGenerator.GenerateUserId(), // Generate ID for the UserRole entry (not the Role)
            UserId = userId,
            RoleId = roleId, // Use the existing role ID from the roles table
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        context.UserRoles.Add(newUserRole);
        await context.SaveChangesAsync();
    }


    public async Task<UserPassReset?> GetPasswordResetAsync(string token)
    {
        return await context.UserPasswordResets
            .Include(upr => upr.User)
            .FirstOrDefaultAsync(upr =>
                upr.PasswordResetToken == token &&
                upr.PasswordTokenExpiry > DateTime.UtcNow);
    }
}
