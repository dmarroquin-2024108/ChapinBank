using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class Roles
{
    [Key]
    [MaxLength(16)]
    public string IdRole { get; set;} = string.Empty;

    [Required(ErrorMessage = "El Nombre del Rol es necesario.")]
    [MaxLength(35, ErrorMessage = "El nombre del Rol no puede exceder los 35 carácteres.")]
    public string Name { get; set;} = string.Empty;

    public DateTime CreatedAt { get; set;} = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set;} = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles { get; set; } = [];
}
