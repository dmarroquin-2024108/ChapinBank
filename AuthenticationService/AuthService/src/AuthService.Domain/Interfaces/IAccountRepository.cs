using System;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IAccountRepository
{
    Task<Account?> GetByIdAsync(string id);
    Task AddAsync(Account account);
    Task<IEnumerable<Account>> GetByUserIdAsync(string userId);

}
