using System;
using System.Formats.Asn1;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

/// <summary>
/// Gestión de autenticación y usuarios de ChapinBank
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserManagementService _userManagementService;
    private readonly IRefreshTokenService _refreshTokenService;

    public AuthController(IAuthService authService, IUserManagementService userManagementService, IRefreshTokenService refreshTokenService)
    {
        _authService = authService;
        _userManagementService = userManagementService;
        _refreshTokenService = refreshTokenService;
    }

    /// <summary>
    /// Renovar token de acceso
    /// </summary>
    /// <remarks>
    /// Genera un nuevo token JWT a partir de un refresh token válido.
    /// El refresh token anterior es rotado (invalidado y reemplazado).
    /// No requiere autenticación.
    /// </remarks>
    /// <response code="200">Token renovado exitosamente</response>
    /// <response code="400">Refresh token inválido o expirado</response>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
    {
        var result = await _refreshTokenService.RotateAsync(dto.RefreshToken);
        return Ok(result);
    }
    /// <summary>
    /// Cerrar sesión
    /// </summary>
    /// <remarks>
    /// Revoca el refresh token del usuario, invalidando futuras renovaciones de sesión.
    /// Requiere autenticación.
    /// </remarks>
    /// <response code="200">Sesión cerrada exitosamente</response>
    /// <response code="401">No autorizado</response>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout([FromBody] RefreshRequestDto dto)
    {
        await _refreshTokenService.RevokeAsync(dto.RefreshToken);
        return Ok(new { message = "Sesión cerrada" });
    }

    private async Task<bool> CurrentUserIsAdmin()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) return false;
        var roles = await _userManagementService.GetUserRolesAsync(userId);
        return roles.Contains(RoleConstants.ADMIN_ROLE);
    }

    /// <summary>
    /// Obtener perfil del usuario autenticado
    /// </summary>
    /// <remarks>
    /// Devuelve la información del usuario autenticado obtenida desde el token JWT.
    /// Requiere autenticación
    /// </remarks>
    /// <response code="200">Perfil obtenido exitosamente</response>
    /// <response code="401">No autorizado — token inválido o ausente</response>
    /// <response code="404">Usuario no encontrado</response>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> GetProfile()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
        {
            return Unauthorized();
        }

        var user = await _authService.GetUserByIdAsync(userIdClaim.Value);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    /// <summary>
    /// Obtener perfil de un usuario por su ID
    /// </summary>
    /// <remarks>
    /// Endpoint interno para que otros servicios consulten el perfil de un usuario por su ID.
    /// </remarks>
    /// <response code="200">Perfil obtenido exitosamente</response>
    /// <response code="400">El userId es requerido</response>
    /// <response code="404">Usuario no encontrado</response>
    [HttpPost("profile/by-id")]
    [EnableRateLimiting("ApiPolicy")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> GetProfileById([FromBody] GetProfileByIdDto request)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return BadRequest(new
            {
                success = false,
                message = "El userId es requerido"
            });
        }

        var user = await _authService.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Usuario no encontrado"
            });
        }

        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    /// <summary>
    /// Crear usuario (admin)
    /// </summary>
    /// <remarks>
    /// Crea un nuevo usuario con cualquier rol. Solo accesible por administradores.
    /// Requiere rol ADMIN_ROLE o SUPERADMIN_ROLE
    /// </remarks>
    /// <response code="201">Usuario creado exitosamente</response>
    /// <response code="401">No autorizado</response>
    /// <response code="403">Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE</response>
    [HttpPost("admin/create-user")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<RegisterResponseDto>> CreateUserByAdmin([FromBody] AdminCreateUserDto dto)
    {
        var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? RoleConstants.USER_ROLE;
        var result = await _authService.CreateUserByAdminAsync(dto, currentUserRole);
        return StatusCode(201, result);
    }

    /// <summary>
    /// Iniciar sesión
    /// </summary>
    /// <remarks>
    /// Autentica al usuario con email/username y contraseña y retorna un JWT.
    /// Tiene rate limiting (5 req / 10 seg)
    /// </remarks>
    /// <response code="200">Login exitoso. Retorna el token JWT y datos del usuario</response>
    /// <response code="401">Credenciales inválidas o cuenta inactiva</response>
    /// <response code="429">Demasiadas solicitudes</response>
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new
            {
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Verificar correo electrónico
    /// </summary>
    /// <remarks>
    /// Activa la cuenta del usuario mediante el token de verificación recibido por correo.
    /// Tiene rate limiting (20 req / 10 seg)
    /// </remarks>
    /// <response code="200">Correo verificado exitosamente</response>
    /// <response code="400">Token inválido o expirado</response>
    /// <response code="429">Demasiadas solicitudes</response>
    [HttpPost("verify-email")]
    [EnableRateLimiting("ApiPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var result = await _authService.VerifyEmailAsync(verifyEmailDto);
        return Ok(result);
    }

    /// <summary>
    /// Reenviar correo de verificación
    /// </summary>
    /// <remarks>
    /// Reenvía el correo de verificación al usuario. Solo funciona si la cuenta aún no ha sido verificada.
    /// Tiene rate limiting (5 req / 10 seg)
    /// </remarks>
    /// <response code="200">Correo de verificación reenviado exitosamente</response>
    /// <response code="400">La cuenta ya fue verificada</response>
    /// <response code="404">Usuario no encontrado</response>
    /// <response code="429">Demasiadas solicitudes</response>
    /// <response code="503">Error al enviar el correo</response>
    [HttpPost("resend-verification")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
    {
        var result = await _authService.ResendVerificationEmailAsync(resendDto);

        if (!result.Success)
        {
            if (result.Message.Contains("no encontrado", StringComparison.OrdinalIgnoreCase))
            {
                return NotFound(result);
            }
            if (result.Message.Contains("ya ha sido verificado", StringComparison.OrdinalIgnoreCase) ||
                result.Message.Contains("ya verificado", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(result);
            }

            return StatusCode(503, result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Solicitar restablecimiento de contraseña
    /// </summary>
    /// <remarks>
    /// Envía un correo con el token para restablecer la contraseña.
    /// Tiene rate limiting (5 req / 10 seg)
    /// </remarks>
    /// <response code="200">Instrucciones enviadas al correo exitosamente</response>
    /// <response code="503">Error al enviar el correo</response>
    /// <response code="429">Demasiadas solicitudes</response>
    [HttpPost("forgot-password")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

        if (!result.Success)
        {
            return StatusCode(503, result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Restablecer contraseña
    /// </summary>
    /// <remarks>
    /// Cambia la contraseña del usuario usando el token de recuperación recibido por correo.
    /// Tiene rate limiting (5 req / 10 seg)
    /// </remarks>
    /// <response code="200">Contraseña restablecida exitosamente</response>
    /// <response code="400">Token inválido o expirado</response>
    /// <response code="429">Demasiadas solicitudes</response>
    [HttpPost("reset-password")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        var result = await _authService.ResetPasswordAsync(resetPasswordDto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Actualizar perfil del usuario autenticado
    /// </summary>
    /// <remarks>
    /// Permite al usuario autenticado editar su propia información de perfil.
    /// Requiere autenticación
    /// </remarks>
    /// <response code="200">Perfil actualizado exitosamente</response>
    /// <response code="400">Errores de validación</response>
    /// <response code="401">No autorizado</response>
    [HttpPatch("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> UpdateProfile([FromBody] UpdateUserDto updateUserDto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (userId == null || string.IsNullOrEmpty(userId.Value))
        {
            return Unauthorized();
        }

        try
        {
            var result = await _authService.UpdateUserAsync(userId.Value, updateUserDto);
            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    /// <summary>
    /// Eliminar usuario (admin)
    /// </summary>
    /// <remarks>
    /// Realiza un soft delete del usuario indicado. Solo accesible por administradores.
    /// Requiere rol ADMIN_ROLE o SUPERADMIN_ROLE
    /// </remarks>
    /// <param name="userId">ID del usuario a eliminar</param>
    /// <response code="200">Usuario eliminado exitosamente</response>
    /// <response code="400">Error al eliminar el usuario</response>
    /// <response code="401">No autorizado</response>
    /// <response code="403">Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE</response>
    [HttpDelete("admin/users/{userId}")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> SoftDeleteUser(string userId)
    {
        var currentUserId = User.Claims
            .FirstOrDefault(c => c.Type == "sub" ||
            c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
        ?.Value?? string.Empty;

        try
        {
            await _authService.SoftDeleteUserAsync(userId, currentUserId);
            return Ok(new
            {
                success = true,
                message = "Usuario eliminado exitosamente"
            });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    /// <summary>
    /// Solicitar eliminación de cuenta propia
    /// </summary>
    /// <remarks>
    /// Envía un token de confirmación al correo del usuario para iniciar el proceso de eliminación de su cuenta.
    /// Requiere autenticación
    /// </remarks>
    /// <response code="200">Token de confirmación enviado al correo</response>
    /// <response code="400">Error al procesar la solicitud</response>
    /// <response code="401">No autorizado</response>
    [HttpPost("me/request-delete")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> RequestAccountDeletion()
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (userId == null || string.IsNullOrEmpty(userId.Value))
            return Unauthorized();
        try
        {
            await _authService.RequestAccountDeletionAsync(userId.Value);
            return Ok(new { success = true, message = "Se ha enviado un token de confirmación a tu correo" });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    /// <summary>
    /// Confirmar eliminación de cuenta propia
    /// </summary>
    /// <remarks>
    /// Confirma la eliminación de la cuenta del usuario autenticado usando el token recibido por correo.
    /// Requiere autenticación
    /// </remarks>
    /// <response code="200">Cuenta eliminada exitosamente</response>
    /// <response code="400">Token inválido o expirado</response>
    /// <response code="401">No autorizado</response>
    [HttpPost("me/confirm-delete")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> ConfirmAccountDeletion([FromBody] ConfirmDeleteDto dto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (userId == null || string.IsNullOrEmpty(userId.Value))
            return Unauthorized();
        try
        {
            await _authService.ConfirmAccountDeletionAsync(userId.Value, dto.Token);
            return Ok(new { success = true, message = "Cuenta eliminada exitosamente" });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    /// <summary>
    /// Cambiar contraseña temporal
    /// </summary>
    /// <remarks>
    /// Permite a un usuario autenticado cambiar su contraseña temporal por una nueva contraseña definitiva.
    /// Requiere autenticación.
    /// </remarks>
    /// <response code="200">Contraseña actualizada exitosamente</response>
    /// <response code="400">Error en la solicitud o contraseña inválida</response>
    /// <response code="401">No autorizado</response>
    [HttpPost("change-temp-password")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> ChangeTempPassword([FromBody] ChangeTempPasswordDto dto)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (userId == null) return Unauthorized();

        var result = await _authService.ChangeTempPasswordAsync(userId.Value, dto.NewPassword);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Resumen de usuarios (admin)
    /// </summary>
    /// <remarks>
    /// Devuelve el total de usuarios, activos, inactivos y los 5 más recientes.
    /// Requiere rol ADMIN_ROLE o SUPERADMIN_ROLE.
    /// </remarks>
    /// <response code="200">Resumen obtenido exitosamente</response>
    /// <response code="401">No autorizado</response>
    /// <response code="403">Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE</response>
    [HttpGet("admin/users/summary")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    [ProducesResponseType(typeof(UserSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<UserSummaryDto>> GetUsersSummary()
    {
        var summary = await _userManagementService.GetUsersSummaryAsync();
        return Ok(new
        {
            success = true,
            message = "Resumen de usuarios obtenido exitosamente",
            data = summary
        });
    }

    /// <summary>
    /// Listar todos los usuarios (admin)
    /// </summary>
    /// <remarks>
    /// Devuelve todos los usuarios del sistema con su rol y estado.
    /// Requiere rol ADMIN_ROLE o SUPERADMIN_ROLE.
    /// </remarks>
    /// <response code="200">Usuarios obtenidos exitosamente</response>
    /// <response code="401">No autorizado</response>
    /// <response code="403">Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE</response>
    [HttpGet("admin/users")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    [ProducesResponseType(typeof(IReadOnlyList<UserResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<UserResponseDto>>> GetAllUsers()
    {
        var result = await _userManagementService.GetAllUsersAsync();
        return Ok(new
        {
            success = true,
            message = "Usuarios obtenidos exitosamente",
            total = result.Count,
            data = result
        });
    }
}