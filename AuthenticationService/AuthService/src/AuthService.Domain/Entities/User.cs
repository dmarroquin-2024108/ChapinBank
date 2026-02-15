using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class User
{
    [Key]
    [MaxLength(16)]
    public string IdUser { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es un campo obligatorio")]
    [MaxLength(25, ErrorMessage = "El nombre no puede tener más de 25 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es un campo obligatorio")]
    [MaxLength(25, ErrorMessage = "El apellido no puede tener más de 25 caracteres")]
    public string Surname { get; set; } = string.Empty;

    [Required(ErrorMessage = "El username es obligatorio")]
    [MaxLength(25, ErrorMessage = "El username no puede tener más de 25 caracteres")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "El Número de cuenta es obligatorio")]
    [MaxLength(25, ErrorMessage = "El número de cuenta no puede tener más de 25 caracteres")]
    public string NoCuenta {get; set;} = string.Empty;
    public int DPI {get; set;} = 0;

    public string Direction {get; set;} = string.Empty;

    [StringLength(8, MinimumLength =8, ErrorMessage = "El teléfono debe tener 8 dígitos.")]
    [RegularExpression(@"^\d{8}$", ErrorMessage = "El teléfono debe contener solo números.")]
    public string Phone {get; set;} = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "El email no tiene un formato correcto")]
    [MaxLength(150, ErrorMessage = "El email no puede tener más de 150 caracteres")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(8, ErrorMessage = "La contraseña debe de tener al menos 8 caracteres")]
    [MaxLength(255, ErrorMessage = "La contraseña no puede tener más de 255 caracteres")]
    public string PasswordHash { get; set; } = string.Empty;

    public bool RequiereCambioPass {get; set;} = true;

    public string NameWork {get; set;} = string.Empty;

    public double IngresosMensuales {get; set;} = 0.0;

    public double SaldoActual {get; set;} = 0.0;

    public bool Status { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles { get; set; } = [];


    public UserEmail UserEmail { get; set; } = null!;

    public UserPassReset UserPasswordReset { get; set; } = null!;
}
