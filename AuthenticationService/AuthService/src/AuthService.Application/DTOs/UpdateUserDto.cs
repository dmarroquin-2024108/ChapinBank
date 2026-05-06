using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using AuthService.Application.Interfaces;

namespace  AuthService.Application.DTOs;
public class UpdateUserDto
{
    [MinLength(5, ErrorMessage = "Mínimo de caracteres es de 5")]
    public string? Username { get; set; }

    [EmailAddress(ErrorMessage = "Debe de colocar un email válido")]
    public string? Email { get; set; }

    public string? Direction {get; set;} 
    [StringLength(8, MinimumLength =8, ErrorMessage = "El teléfono debe tener 8 dígitos.")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "El teléfono debe contener solo números.")]
    public string? Phone { get; set; } 

    [MinLength(5, ErrorMessage = "Mínimo de caracteres es de 5")]
    public string? NameWork{get; set;}

    [Range(100, double.MaxValue,ErrorMessage = "No puede crear un Usuario si tiene ingresos menores a Q.100.00")]
    public double? IngresosMensuales {get; set;}
    public DateTime? UpdatedAt{get; set;}
}