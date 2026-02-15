using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class UserPassReset
{
    [Key]
    [MaxLength(16)]
    public string IdUserPass {get; set;} = string.Empty;

    [Key]
    [MaxLength(16)]
    public string IdUser {get; set;} = string.Empty;

    [MaxLength(255)]
    public string? PasswordResetToken {get; set;}

    public DateTime? PasswordTokenExpiry {get; set;}//fecha expiracion

    public User User { get; set; } = null!;
}
