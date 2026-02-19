using System;

namespace AuthService.Application.Services;

public class AccountNumberGenerator
{
    public static string GenerateAccountNumber(string type)
    {
        var prefix = type switch
        {
          "AHORRO" => "AH",
          "MONETARIA"=> "MO",
          "TARJETA" => "TA",
          "NINGUNO" => "NAN",
          _ => "XX"
        };
        return prefix + new Random().Next(10000000, 99999999).ToString();
    }

}
