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

[ApiController]
[Route("api/v1/[controller]")]
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

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
    {
        var result = await _refreshTokenService.RotateAsync(dto.RefreshToken);
        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
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

    [HttpGet("profile")]
    [Authorize]
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

    [HttpPost("profile/by-id")]
    [EnableRateLimiting("ApiPolicy")]
    [Authorize]
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

    [HttpPost("admin/create-user")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    public async Task<ActionResult<RegisterResponseDto>> CreateUserByAdmin([FromBody] AdminCreateUserDto dto)
    {
        var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? RoleConstants.USER_ROLE;
        var result = await _authService.CreateUserByAdminAsync(dto, currentUserRole);
        return StatusCode(201, result);
    }

    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        return Ok(result);
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("ApiPolicy")]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var result = await _authService.VerifyEmailAsync(verifyEmailDto);
        return Ok(result);
    }

    [HttpPost("resend-verification")]
    [EnableRateLimiting("AuthPolicy")]
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

    [HttpPost("forgot-password")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

        if (!result.Success)
        {
            return StatusCode(503, result);
        }

        return Ok(result);
    }

    [HttpPost("reset-password")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        var result = await _authService.ResetPasswordAsync(resetPasswordDto);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPatch("me")]
    [Authorize]
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

    [HttpDelete("admin/users/{userId}")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    public async Task<ActionResult> SoftDeleteUser(string userId)
    {
        try
        {
            await _authService.SoftDeleteUserAsync(userId);
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

    [HttpPost("me/request-delete")]
    [Authorize]
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

    [HttpPost("me/confirm-delete")]
    [Authorize]
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
}