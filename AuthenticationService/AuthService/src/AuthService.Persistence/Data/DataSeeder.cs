using System;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // inserta superadmin si no existe
        if (!context.Roles.Any(r => r.Name == RoleConstants.SUPERADMIN_ROLE))
        {
            context.Roles.Add(new Roles
            {
                IdRole = IdGenerator.GenerateRoleId(),
                Name = RoleConstants.SUPERADMIN_ROLE
            });
        }

        //insertar admin si no existe
        if (!context.Roles.Any(r => r.Name == RoleConstants.ADMIN_ROLE))
        {
            context.Roles.Add(new Roles
            {
                IdRole = IdGenerator.GenerateRoleId(),
                Name = RoleConstants.ADMIN_ROLE
            });
        }

        // insertar user si no existe
        if (!context.Roles.Any(r => r.Name == RoleConstants.USER_ROLE))
        {
            context.Roles.Add(new Roles
            {
                IdRole = IdGenerator.GenerateRoleId(),
                Name = RoleConstants.USER_ROLE
            });
        }

        await context.SaveChangesAsync();

        if (!await context.Users.AnyAsync(u => u.Username == "superadmin"))
        {
            var superAdminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == RoleConstants.SUPERADMIN_ROLE);
            if (superAdminRole != null)
            {
                var passwordHasher = new PasswordHashService();
                var userId = IdGenerator.GenerateUserId();
                var emailId = IdGenerator.GenerateUserId();
                var userRoleId = IdGenerator.GenerateUserId();

                var superAdminUser = new User
                {
                    IdUser = userId,
                    Name = "Super Admin",
                    Surname = "Admin Admin",
                    Username = "superadmin",
                    DPI = 0000000000101,
                    Direction = "Zona 1, Ciudad de Guatemala",
                    Phone = "12345678",
                    Email = "superadmin@example.com",
                    PasswordHash = passwordHasher.HasPassword("SuperAdmin!"),
                    RequiereCambioPass = false,
                    NameWork = "Chapin Bank",
                    Status = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,


                    UserEmail = new UserEmail
                    {
                        IdEmail = emailId,
                        IdUser = userId,
                        EmailVerified = true,
                        EmailVerificationToken = null,
                        EmailVerificationTokenExpiry = null
                    },

                    UserRoles =
                    [
                        new UserRole
                        {
                            IdUserRole = userRoleId,
                            UserId = userId,
                            RoleId = superAdminRole.IdRole
                        }
                    ]


                };

                await context.Users.AddAsync(superAdminUser);
                await context.SaveChangesAsync();
            
            }
        }
    }
}
