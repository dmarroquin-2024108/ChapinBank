using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs.Email;

public class ConfirmDeleteDto
{
    public string Token { get; set; } = string.Empty;
}