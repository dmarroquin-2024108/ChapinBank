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
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string? Role { get; set;}
    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}
