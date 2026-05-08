using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs.Email;

public class ResendVerificationDto
{
    [Required(ErrorMessage = "El email es obigatorio")]
    [EmailAddress(ErrorMessage = "Debe de ingresar un email válido")]
    public string Email { get; set; } = string.Empty;
}
