using System;

namespace AuthService.Application.Interfaces;

public interface IPassHashService
{
    string HasPassword(string password);
    bool VerifyPassword(string password, string hasedPassword);
}
