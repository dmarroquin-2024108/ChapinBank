using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class Account
{
    [Key]
    public string IdAccount {get; set;} = string.Empty;
    [Required]
    [MaxLength(20)]
    
    public string AccountNumber {get; set;} = string.Empty;
    [Required]
    public string AccountType {get; set;} = string.Empty;

    [Required]
    public string UserId {get; set;} = string.Empty; // el usuario que el admin usa para crear la cuenta

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User{get; set;} = null!;
}
