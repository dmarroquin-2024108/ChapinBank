using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class CreateAccountDto
{
    [Required]
    public string UserId {get; set;} = string.Empty;

    [Required]
    public string AccountType {get; set;} = string.Empty;//monetaria, ahorro, tarjeta, ninguno


}
