using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Exceptions;
using AuthService.Application.Extensions;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class AuthService(
    IRefreshTokenService refreshTokenService,
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPassHashService passHashService,
    IJwtTokenService jwtTokenService,
    IEmailService emailService,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<RegisterResponseDto> CreateUserByAdminAsync(AdminCreateUserDto dto, string currentUserRole)
    {
        var rolName = string.IsNullOrEmpty(dto.Role) ? RoleConstants.USER_ROLE : dto.Role;
        if (currentUserRole == RoleConstants.USER_ROLE)
        {
            throw new BusinessException(ErrorCodes.UNAUTHORIZED_ROLE_ASSIGNMENT, "Un usuario no tiene permisos para asignar roles");
        }

        if (currentUserRole == RoleConstants.ADMIN_ROLE && rolName == RoleConstants.ADMIN_ROLE)
        {
            throw new BusinessException(ErrorCodes.UNAUTHORIZED_ROLE_ASSIGNMENT, "Un admin no puede crear otro admin, únicamente usuarios");
        }

        var deletedUser = await userRepository.GetDeletedByEmailAsync(dto.Email);
        if (deletedUser != null)
        {
            var reactivationToken = TokenGenerator.GenerateEmailVerifiToken();
            deletedUser.IsDeleted = false;
            deletedUser.DeletedAt = null;
            deletedUser.Status = false;
            deletedUser.Name = dto.Name;
            deletedUser.Surname = dto.Surname;
            deletedUser.Username = dto.Username;
            deletedUser.DPI = dto.DPI;
            deletedUser.Direction = dto.Direction;
            deletedUser.Phone = dto.Phone;
            deletedUser.NameWork = dto.NameWork;
            deletedUser.IngresosMensuales = dto.IngresosMensuales;
            deletedUser.PasswordHash = passHashService.HasPassword(dto.Password);
            deletedUser.RequiereCambioPass = true;
            deletedUser.UpdatedAt = DateTime.UtcNow;

            if (deletedUser.UserEmail != null)
            {
                deletedUser.UserEmail.EmailVerified = false;
                deletedUser.UserEmail.EmailVerificationToken = reactivationToken;
                deletedUser.UserEmail.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            }

            await userRepository.UpdateAsync(deletedUser);
            await emailService.SendAdminCreatedUserEmailAsync(deletedUser.Email, deletedUser.Username, dto.Password, reactivationToken);

            return new RegisterResponseDto
            {
                Success = true,
                User = MapToUserResponseDto(deletedUser),
                Message = "Cuenta reactivada. Revise su correo para activarla",
                EmailVerificationRequired = true
            };
        }//Verificar si la cuenta ya existia para reactivarla

        // verificar si el email ya existe
        if (await userRepository.ExistsByEmailAsync(dto.Email))
        {
            logger.LogRegistrationWithExistingEmail();
            throw new BusinessException(ErrorCodes.EMAIL_ALREADY_EXISTS, "El email ya existe");
        }

        // verficai si el username ya existe
        if (await userRepository.ExistsByUsernameAsync(dto.Username))
        {
            logger.LogRegistrationWithExistingUsername();
            throw new BusinessException(ErrorCodes.USERNAME_ALREADY_EXISTS, "El nombre de usuario ya existe");
        }

        // Crear nuevo usuario y entidades relacionadas
        var emailVerificationToken = TokenGenerator.GenerateEmailVerifiToken();
        var userId = IdGenerator.GenerateUserId();
        var userEmailId = IdGenerator.GenerateUserId();
        var userRoleId = IdGenerator.GenerateUserId();
        var userPasswordResetId = IdGenerator.GenerateUserId();

        // Obtener el rol y mandar un mensaje si no se encontró
        var defaultRole = await roleRepository.GetByNameAsync(rolName);
        if (defaultRole == null)
        {
            throw new InvalidOperationException($"Rol por defecto '{rolName}' no encontrado. Asegúrese de que la siembra se ejecute antes del registro");
        }
        var user = new User
        {
            IdUser = userId,
            Name = dto.Name,
            Surname = dto.Surname,
            Username = dto.Username,
            DPI = dto.DPI,
            Direction = dto.Direction,
            Phone = dto.Phone,
            NameWork = dto.NameWork,
            IngresosMensuales = dto.IngresosMensuales,
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = passHashService.HasPassword(dto.Password),
            Status = false,
            RequiereCambioPass = true,
            UserEmail = new UserEmail
            {
                IdEmail = userEmailId,
                EmailVerified = false,
                EmailVerificationToken = emailVerificationToken,
                EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            },
            UserRoles =
            [
                new Domain.Entities.UserRole
                {
                    IdUserRole = userRoleId,
                    UserId = userId,
                    RoleId = defaultRole.IdRole
                }
            ],
            UserPasswordReset = new UserPassReset
            {
                IdUserPass = userPasswordResetId,
                IdUser = userId,
                PasswordResetToken = null,
                PasswordTokenExpiry = null
            }
        };

        //guardar usuario y entidades relacionadas  
        var createdUser = await userRepository.CreateAsync(user);
        logger.LogInformation(createdUser.Username);

        await emailService.SendAdminCreatedUserEmailAsync(user.Email, user.Username, dto.Password, emailVerificationToken);

        return new RegisterResponseDto
        {
            Success = true,
            User = MapToUserResponseDto(createdUser),
            Message = "Usuario creado por admin. Revise su correo para activar la cuenta",
            EmailVerificationRequired = true
        };
    }


    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // Buscar usuario por email o username
        User? user = null;

        if (loginDto.EmailOrUsername.Contains('@'))
        {
            // Es un email
            user = await userRepository.GetByEmailAsync(loginDto.EmailOrUsername.ToLowerInvariant());
        }
        else
        {
            // Es un username
            user = await userRepository.GetByUsernameAsync(loginDto.EmailOrUsername);
        }

        // Verificar si el usuario existe
        if (user == null)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        // Verificar si el usuario fue eliminado
        if (user.IsDeleted)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Esta cuenta ha sido eliminada");
        }

        // Verificar si el usuario está activo
        if (!user.Status)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("La cuenta de usuario está deshabilitada");
        }

        // Verificar contraseña
        if (!passHashService.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        if (user.RequiereCambioPass)
        {
            var tempToken = jwtTokenService.GenerateToken(user);
            var tempExpiryMinutes = int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "30");
            var (tempRefreshToken, _) = await refreshTokenService.CreateAsync(user.IdUser);

            return new AuthResponseDto
            {
                Success = false,
                Message = "Debe cambiar su contraseña temporal",
                RequiresPasswordChange = true,
                Token = tempToken,
                RefreshToken = tempRefreshToken,
                UserDetails = MapToUserDetailsDto(user),
                ExpiresAt = DateTime.UtcNow.AddMinutes(tempExpiryMinutes)
            };
        }

        logger.LogUserLoggedIn();

        // genera un token 
        var token = jwtTokenService.GenerateToken(user);
        var expiryMinutes = int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "30");
        var (refreshToken, _) = await refreshTokenService.CreateAsync(user.IdUser);
        // se crea respuesta a conveniencia
        return new AuthResponseDto
        {
            Success = true,
            Message = "Login EXITOSOS",
            Token = token,
            RefreshToken = refreshToken,
            UserDetails = MapToUserDetailsDto(user),
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }


    private UserResponseDto MapToUserResponseDto(User user)
    {
        var userRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE;
        return new UserResponseDto
        {
            IdUserResponse = user.IdUser,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            Role = userRole,
            Phone = user.Phone,
            Direction = user.Direction,
            NameWork = user.NameWork,
            IngresosMensuales = user.IngresosMensuales,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            IsDeleted = user.IsDeleted,
            CreatedAt = user.CreatedAt,
            DeleteAt = user.DeletedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private UserDetailsDto MapToUserDetailsDto(User user)
    {
        return new UserDetailsDto
        {
            IdUserDetail = user.IdUser,
            Name = user.Name,
            Surname = user.Surname,
            Email = user.Email,
            Username = user.Username,
            NameWork = user.NameWork,
            Role = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE,
            Status = user.Status,
            RequiresPasswordChange = user.RequiereCambioPass,
            IsDeleted = user.IsDeleted
        };
    }

    public async Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
    {
        var user = await userRepository.GetByEmailVerifiAsync(verifyEmailDto.Token);
        if (user == null || user.UserEmail == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "El token de verificación inválido o expirado"
            };
        }

        user.UserEmail.EmailVerified = true;
        user.Status = true;
        user.UserEmail.EmailVerificationToken = null;
        user.UserEmail.EmailVerificationTokenExpiry = null;

        await userRepository.UpdateAsync(user);

        // Enviar email de bienvenida
        try
        {
            await emailService.SendWelcomeEmailAsync(user.Email, user.Username);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send welcome email to {Email}", user.Email);
        }

        logger.LogInformation("Email verified successfully for user {Username}", user.Username);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Email verificado exitosamente",
            Data = new
            {
                email = user.Email,
                verified = true
            }
        };
    }

    public async Task<EmailResponseDto> ResendVerificationEmailAsync(ResendVerificationDto resendDto)
    {
        var user = await userRepository.GetByEmailAsync(resendDto.Email);
        if (user == null || user.UserEmail == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Usuario no encontrado",
                Data = new { email = resendDto.Email, sent = false }
            };
        }

        if (user.UserEmail.EmailVerified)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "El Email ya ha sido verificado",
                Data = new { email = user.Email, verified = true }
            };
        }

        // Generar nuevo token
        var newToken = TokenGenerator.GenerateEmailVerifiToken();
        user.UserEmail.EmailVerificationToken = newToken;
        user.UserEmail.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);

        await userRepository.UpdateAsync(user);

        // Enviar email
        try
        {
            await emailService.SendEmailVerificationAsync(user.Email, user.Username, newToken);
            return new EmailResponseDto
            {
                Success = true,
                Message = "Email de verificación enviado exitosamente",
                Data = new { email = user.Email, sent = true }
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to resend verification email to {Email}", user.Email);
            return new EmailResponseDto
            {
                Success = false,
                Message = "Error al enviar el email de verificación",
                Data = new { email = user.Email, sent = false }
            };
        }
    }

    public async Task<EmailResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await userRepository.GetByEmailAsync(forgotPasswordDto.Email);
        if (user == null)
        {
            // Por seguridad, siempre devolvemos éxito aunque el usuario no exista
            return new EmailResponseDto
            {
                Success = true,
                Message = "Si el email existe, se ha enviado un enlace de recuperación",
                Data = new { email = forgotPasswordDto.Email, initiated = true }
            };
        }

        // Generar token de reset
        var resetToken = TokenGenerator.GeneratePasswordResetToken();

        if (user.UserPasswordReset == null)
        {
            var resetEntry = new UserPassReset
            {
                IdUserPass = Guid.NewGuid().ToString("N").Substring(0, 16),
                //primero idUser de UserPassReset, luego idUser de user
                IdUser = user.IdUser,
                PasswordResetToken = resetToken,
                PasswordTokenExpiry = DateTime.UtcNow.AddHours(1)
            };
            await userRepository.AddPasswordResetAsync(resetEntry);
        }
        else
        {
            user.UserPasswordReset.PasswordResetToken = resetToken;
            user.UserPasswordReset.PasswordTokenExpiry = DateTime.UtcNow.AddHours(1); // 1 hora para resetear
            await userRepository.UpdateAsync(user);

        }


        // Enviar email
        try
        {
            await emailService.SendPasswordResetAsync(user.Email, user.Username, resetToken);
            logger.LogInformation("Password reset email sent to {Email}", user.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
        }

        return new EmailResponseDto
        {
            Success = true,
            Message = "Si el email existe, se ha enviado un enlace de recuperación",
            Data = new { email = forgotPasswordDto.Email, initiated = true }
        };
    }


    public async Task<EmailResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await userRepository.GetByPassResetTokenAsync(resetPasswordDto.Token);
        if (user == null || user.UserPasswordReset == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Token de restablecimiento inválido o expirado",
                Data = new { token = resetPasswordDto.Token, reset = false }
            };
        }

        //Verificar si el token ya fue usado (es null cuando se usó)
        if (user.UserPasswordReset.PasswordResetToken == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Este enlace ya fue utilizado, solicite uno nuevo."
            };
        }

        // actualizar contraseña
        user.PasswordHash = passHashService.HasPassword(resetPasswordDto.NewPassword);
        user.RequiereCambioPass = false;
        user.UserPasswordReset.PasswordResetToken = null;
        user.UserPasswordReset.PasswordTokenExpiry = null;

        await userRepository.UpdateAsync(user);

        // Enviar email de bienvenida
        try
        {
            await emailService.SendPasswordChangeAsync(user.Email, user.Username);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send welcome email to {Email}", user.Email);
        }

        logger.LogInformation("Password reset successfully for user {Username}", user.Username);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Contraseña actualizada exitosamente",
            Data = new { email = user.Email, reset = true }
        };
    }

    public async Task<UpdateUserDto?> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("Usuario no encontrado");
        if (updateUserDto.Username != null)
        {
            if (await userRepository.ExistsByUsernameAsync(updateUserDto.Username)) throw new Exception("El username ya existe.");
            user.Username = updateUserDto.Username;
        }

        if (updateUserDto.Email != null)
        {
            if (await userRepository.ExistsByEmailAsync(updateUserDto.Email)) throw new Exception("Email ya existente.");
            user.Email = updateUserDto.Email;
        }

        if (updateUserDto.Direction != null) user.Direction = updateUserDto.Direction;
        if (updateUserDto.Phone != null) user.Phone = updateUserDto.Phone;
        if (updateUserDto.NameWork != null) user.NameWork = updateUserDto.NameWork;
        if (updateUserDto.IngresosMensuales != null) user.IngresosMensuales = updateUserDto.IngresosMensuales.Value;

        await userRepository.UpdateAsync(user);

        return new UpdateUserDto
        {
            Username = user.Username,
            Email = user.Email,
            Direction = user.Direction,
            Phone = user.Phone,
            NameWork = user.NameWork,
            IngresosMensuales = user.IngresosMensuales,
            UpdatedAt = user.UpdatedAt
        };
    }//Actualizar el Usuario (PATCH)

    public async Task<bool> SoftDeleteUserAsync(string userId, string currentUserId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("Usuario no encontrado");
        if (user.IsDeleted) throw new Exception("El usuario ya fue eliminado");

        // No se puede eliminar una cuenta de superadmin
        var isSuperAdmin = user.UserRoles.Any(r => r.Role?.Name == RoleConstants.SUPERADMIN_ROLE)
        ;
        if (isSuperAdmin) throw new Exception("No se puede eliminar una cuenta de Superadmin");
        if (userId == currentUserId)
        throw new InvalidOperationException("No puedes eliminar tu propia cuenta");
        return await userRepository.SoftDeleteAsync(userId);
    }//Lógica para el admin si quiere desactivar cuentas

    public async Task RequestAccountDeletionAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("Usuario no encontrado");
        if (user.IsDeleted) throw new Exception("La cuenta ya fue eliminada");

        // Generar token y guardarlo en UserPasswordReset
        var token = TokenGenerator.GeneratePasswordResetToken();

        if (user.UserPasswordReset == null)
        {
            var resetEntry = new UserPassReset
            {
                IdUserPass = IdGenerator.GenerateUserId(),
                IdUser = userId,
                PasswordResetToken = token,
                PasswordTokenExpiry = DateTime.UtcNow.AddHours(1)
            };
            await userRepository.AddPasswordResetAsync(resetEntry);
        }
        else
        {
            user.UserPasswordReset.PasswordResetToken = token;
            user.UserPasswordReset.PasswordTokenExpiry = DateTime.UtcNow.AddHours(1);
            await userRepository.UpdateAsync(user);
        }

        await emailService.SendAccountDeletionConfirmationAsync(user.Email, user.Username, token);
        logger.LogInformation("Account deletion requested for user {Username}", user.Username);
    }//Manda token de verificación para confirmar la desactivacion de la cuenta

    public async Task<bool> ConfirmAccountDeletionAsync(string userId, string token)
    {
        var user = await userRepository.GetByPassResetTokenAsync(token);
        if (user == null || user.UserPasswordReset == null)
            throw new Exception("Token inválido o expirado");

        // Verificar que el token pertenece al usuario que hace la petición
        if (user.IdUser != userId)
            throw new Exception("Token inválido o expirado");

        if (user.IsDeleted) throw new Exception("La cuenta ya fue eliminada");

        // Limpiar el token y hacer soft delete
        user.UserPasswordReset.PasswordResetToken = null;
        user.UserPasswordReset.PasswordTokenExpiry = null;
        await userRepository.UpdateAsync(user);

        return await userRepository.SoftDeleteAsync(userId);
    }//Para el usuario que quiera desactivar su cuenta

    public async Task<UserResponseDto?> GetUserByIdAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null || user.IsDeleted)
        {
            return null;
        }
        return MapToUserResponseDto(user);
    }

    public async Task<AuthResponseDto> ChangeTempPasswordAsync(string userId, string newPassword)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
            return new AuthResponseDto { Success = false, Message = "Usuario no encontrado" };

        user.PasswordHash = passHashService.HasPassword(newPassword);
        user.RequiereCambioPass = false;
        await userRepository.UpdateAsync(user);

        return new AuthResponseDto { Success = true, Message = "Contraseña actualizada exitosamente" };
    }
}
