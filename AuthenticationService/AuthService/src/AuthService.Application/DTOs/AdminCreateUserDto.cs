using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class AdminCreateUserDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public int DPI { get; set; } = 0;

    [Required]
    public string Direction { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength =8, ErrorMessage = "el teléfono debe tener 8 caracteres")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string NameWork { get; set; } = string.Empty;

    [Required]
    public double IngresosMensuales { get; set; } = 0.0;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string? Role { get; set;}
    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}
