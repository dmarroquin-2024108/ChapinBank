using System;

namespace AuthService.Application.DTOs;

public class RecentUserDto
{
    public string IdUser { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
