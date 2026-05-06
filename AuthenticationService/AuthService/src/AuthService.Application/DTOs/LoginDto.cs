using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class LoginDto
{
    [Required (ErrorMessage = "Debe de ingresar el usuario o email")]
    public string EmailOrUsername { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe de colocar la contraseña")]
    public string Password { get; set; } = string.Empty;
}
