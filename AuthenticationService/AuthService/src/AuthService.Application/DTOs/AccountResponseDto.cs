using System;

namespace AuthService.Application.DTOs;

public class AccountResponseDto
{
    public string IdAccount { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
