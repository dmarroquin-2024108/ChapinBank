using System;
using AuthService.Application.DTOs;
using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces;

public interface IAccountService
{
    Task<Account> CreateAccountAsync(CreateAccountDto dto, string currentUserRole);
    Task<Account?> GetAccountByIdAsync(string accountId);
    Task<IEnumerable<Account>> GetAccountsByUserAsync(string userId);

}
