using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class AdminCreateUserDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [MaxLength(25, ErrorMessage = "El nombre no puede exceder de 25 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio")]
    [MaxLength(25, ErrorMessage = "El apellido no puede exceder de 25 caracteres")]
    public string Surname { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "El DPI es obligatorio")]
    [RegularExpression(@"^\d{13}$", ErrorMessage = "Debe tener exactamente 13 dígitos")]
    public string DPI { get; set; } = string.Empty;

    [Required(ErrorMessage = "La direccion es obligatoria")]
    public string Direction { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "El teléfono debe de tener exactamente 8 dígitos")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre del puesto es obligatorio")]
    public string NameWork { get; set; } = string.Empty;

    [Required(ErrorMessage = "Los ingresos mensuales son obligatorios")]
    [Range(100, double.MaxValue, ErrorMessage = "No puede crear un Usuario si tiene ingresos menores a Q.100.00")]
    public double IngresosMensuales { get; set; } = 0.00;

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress(ErrorMessage = "Ingrese un correo válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "El Role es obligatorio")]
    public string? Role { get; set;}

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(8, ErrorMessage = "La contraseña debe de tener como mínimo 8 caracteres")]
    public string Password { get; set; } = string.Empty;
}
