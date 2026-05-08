using System;

namespace AuthService.Application.DTOs;

public class UserSummaryDto
{
    public int Total { get; set; }
    public int Active { get; set; }
    public int Inactive { get; set; }
    public List<RecentUserDto> RecentUsers { get; set; } = [];
}


