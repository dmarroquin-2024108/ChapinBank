using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class UserEmail
{
    [Key]
    [MaxLength(16)]
    public string IdEmail {get; set;} = string.Empty;

    [Key]
    [MaxLength(16)]
    public string IdUser {get; set;} = string.Empty;

    [Required]
    public bool EmailVerified {get; set;} = false;

    [MaxLength(255)]
    public string? EmailVerificationToken {get; set;}

    public DateTime? EmailVerificationTokenExpiry {get; set;}

    public User User { get; set; } = null!;
}
