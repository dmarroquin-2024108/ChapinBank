using System;
using AuthService.Application.DTOs;
using AuthService.Application.Exceptions;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

namespace AuthService.Application.Services;

public class AccountService : IAccountService
{
    public readonly IAccountRepository accountRepository;
    public readonly IUserRepository userRepository;

    public AccountService(IAccountRepository accountRepository, IUserRepository userRepository)
    {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public async Task<Account> CreateAccountAsync(CreateAccountDto dto, string currentUserRole)
    {
        var user = await userRepository.GetByIdAsync(dto.UserId);
        if (user == null)
            throw new BusinessException("USER_NOT_FOUND", "Usuario no encontrado");

        // Validación de ingresos solo para clientes
        if (currentUserRole == RoleConstants.USER_ROLE && user.IngresosMensuales < 100)
            throw new BusinessException("LOW_INCOME", "Ingresos insuficientes para crear cuenta");

        // Admin puede crear cuenta "NINGUNO" sin ingresos
        if (currentUserRole == RoleConstants.ADMIN_ROLE && dto.AccountType == "NINGUNO")
        {
            // skip validation
        }

        var accountNumber = AccountNumberGenerator.GenerateAccountNumber(dto.AccountType);

        var account = new Account
        {
            IdAccount = IdGenerator.GenerateAccountId(),
            AccountNumber = accountNumber,
            AccountType = dto.AccountType,
            UserId = dto.UserId
        };

        await accountRepository.AddAsync(account);
        return account;
    }

    public async Task<Account?> GetAccountByIdAsync(string accountId)
    {
        return await accountRepository.GetByIdAsync(accountId);
    }

    public async Task<IEnumerable<Account>> GetAccountsByUserAsync(string userId)
    {
        return await accountRepository.GetByUserIdAsync(userId);
    }


}
