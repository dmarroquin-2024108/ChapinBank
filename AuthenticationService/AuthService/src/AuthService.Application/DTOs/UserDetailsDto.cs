namespace AuthService.Application.DTOs;

public class UserDetailsDto
{
    public string IdUserDetail { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string NameWork { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Status {get; set;}
    public bool RequiresPasswordChange { get; set; }
    public bool IsDeleted { get; set; }
}
