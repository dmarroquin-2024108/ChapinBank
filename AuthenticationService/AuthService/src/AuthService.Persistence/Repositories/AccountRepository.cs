using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly ApplicationDbContext context;

    public AccountRepository(ApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<Account?> GetByIdAsync(string id)
    {
        return await context.Accounts.FirstOrDefaultAsync(a => a.IdAccount == id);
    }

    public async Task AddAsync(Account account)
    {
        await context.Accounts.AddAsync(account);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Account>> GetByUserIdAsync(string userId)
    {
        return await context.Accounts
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }
}