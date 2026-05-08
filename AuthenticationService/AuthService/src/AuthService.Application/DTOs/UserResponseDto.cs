namespace AuthService.Application.DTOs;

public class UserResponseDto
{
    public string Dpi {get; set;}= string.Empty;
    public string IdUserResponse { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Direction {get; set;} = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string NameWork {get; set;} = string.Empty;
    public double IngresosMensuales {get; set;} = 0.00;
    public bool Status { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsDeleted{get; set;}
    public DateTime? DeleteAt {get; set;}
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
