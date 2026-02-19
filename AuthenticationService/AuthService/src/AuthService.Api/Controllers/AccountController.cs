using System;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Constants;
using AuthService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService accountService;
    public AccountController(IAccountService accountService)
    {
        this.accountService = accountService;
    }

    //crea la cuenta de servicio para el usuario
    [HttpPost("admin/create-service-account")]
    [Authorize(Roles = RoleConstants.ADMIN_ROLE + "," + RoleConstants.SUPERADMIN_ROLE)]
    public async Task<ActionResult<object>> CreateAccount([FromBody] CreateAccountDto dto)
    {
        var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? RoleConstants.USER_ROLE;
        var account = await accountService.CreateAccountAsync(dto, currentUserRole);
        //se evitan ciclos de referencia al convertir a DTO
        var accountDto = new AccountResponseDto
        {
            IdAccount = account.IdAccount,
            AccountNumber = account.AccountNumber,
            AccountType = account.AccountType,
            UserId = account.UserId,
        };


        return Ok(new
        {
            success = true,
            message = "Cuenta de servicio creada exitosamente",
            data = accountDto
        });
    }

}
