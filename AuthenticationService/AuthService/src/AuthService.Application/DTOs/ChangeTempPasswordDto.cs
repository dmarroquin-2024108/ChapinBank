using System.ComponentModel.DataAnnotations;

public class ChangeTempPasswordDto
{
    [MinLength(8, ErrorMessage = "La Nueva contraseña debe de tener como mínimo 8 caracteres")]
    public string NewPassword { get; set; } = string.Empty;
}