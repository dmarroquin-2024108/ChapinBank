using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;

namespace AuthService.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
    Task<EmailResponseDto> ResendVerificationEmailAsync(ResendVerificationDto resendDto);
    Task<EmailResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<EmailResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    Task<UpdateUserDto?>UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
    Task<bool> SoftDeleteUserAsync(string userId, string currentUserId);
    Task RequestAccountDeletionAsync(string userId);
    Task<bool> ConfirmAccountDeletionAsync(string userId, string token);
    Task<UserResponseDto?> GetUserByIdAsync(string userId);
    Task<AuthResponseDto> ChangeTempPasswordAsync(string userId, string newPassword);
    Task<RegisterResponseDto> CreateUserByAdminAsync(AdminCreateUserDto dto, string currentUserRole);

}
