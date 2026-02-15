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
        var rolName = string.IsNullOrEmpty(dto.Role)? RoleConstants.USER_ROLE : dto.Role;
        if (currentUserRole == RoleConstants.USER_ROLE)
        {
            throw new BusinessException(ErrorCodes.UNAUTHORIZED_ROLE_ASSIGNMENT, "Un usuario no tiene permisos para asignar roles");
        }

        if (currentUserRole == RoleConstants.ADMIN_ROLE && rolName == RoleConstants.ADMIN_ROLE)
        {
            throw new BusinessException(ErrorCodes.UNAUTHORIZED_ROLE_ASSIGNMENT, "Un admin no puede crear otro admin, únicamente usuarios");
        }   


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
        var userEmailId =IdGenerator.GenerateUserId();
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
            return new AuthResponseDto
            {
                Success = false,
                Message = "Debe cambiar su contraseña temporal",
                RequiresPasswordChange = true
            };
        }

        logger.LogUserLoggedIn();

        // genera un token 
        var token = jwtTokenService.GenerateToken(user);
        var expiryMinutes = int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "30");

        // se crea respuesta a conveniencia
        return new AuthResponseDto
        {
            Success = true,
            Message = "Login EXITOSOS",
            Token = token,
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
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private UserDetailsDto MapToUserDetailsDto(User user)
    {
        return new UserDetailsDto
        {
            IdUserDetail = user.IdUser,
            Username = user.Username,
            Role = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE
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
                IdUserPass= Guid.NewGuid().ToString("N").Substring(0, 16),
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

        // actualizar contraseña
        user.PasswordHash = passHashService.HasPassword(resetPasswordDto.NewPassword);
        user.RequiereCambioPass = false;
        user.UserPasswordReset.PasswordResetToken = null;
        user.UserPasswordReset.PasswordTokenExpiry = null;

        await userRepository.UpdateAsync(user);

        logger.LogInformation("Password reset successfully for user {Username}", user.Username);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Contraseña actualizada exitosamente",
            Data = new { email = user.Email, reset = true }
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        return MapToUserResponseDto(user);
    }



}
