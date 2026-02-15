using System;
using System.Security.Cryptography;
using System.Text;
using AuthService.Application.Interfaces;
using Konscious.Security.Cryptography;

namespace AuthService.Application.Services;

public class PasswordHashService : IPassHashService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 2;
    private const int Memory = 102400;  
    private const int Parallelism = 8; 

    public string HasPassword(string password)
    {
        var salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            DegreeOfParallelism = Parallelism,
            Iterations = Iterations,
            MemorySize = Memory
        };

        var hash = argon2.GetBytes(HashSize);

        // formatear en el formato estándar Argon2
        var saltBase64 = Convert.ToBase64String(salt);
        var hashBase64 = Convert.ToBase64String(hash);

        return $"$argon2id$v=19$m={Memory},t={Iterations},p={Parallelism}${saltBase64}${hashBase64}";
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        try
        {
            Console.WriteLine($"[DEBUG] Verifying password for hash: {hashedPassword.Substring(0, Math.Min(50, hashedPassword.Length))}...");

            // verificar si es el formato estandar Argon2
            if (hashedPassword.StartsWith("$argon2id$"))
            {
                Console.WriteLine("[DEBUG] Using Argon2 standard format verification");
                var result = VerifyArgon2StandardFormat(password, hashedPassword);
                Console.WriteLine($"[DEBUG] Verification result: {result}");
                return result;
            }
            else
            {
                Console.WriteLine("[DEBUG] Using legacy format verification");
                return VerifyLegacyFormat(password, hashedPassword);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DEBUG] Exception in VerifyPassword: {ex.Message}");
            return false;
        }
    }

    private bool VerifyArgon2StandardFormat(string password, string hashedPassword)
    {
        try
        {
            // usar la verificación nativa de Argon2 que maneja el formato estándar automáticamente
            var argon2Verifier = new Argon2id(Encoding.UTF8.GetBytes(password));

            // se parsea el hash manualmente para extraer los componentes
            var parts = hashedPassword.Split('$');
            if (parts.Length != 6) return false;

            var paramsPart = parts[3]; // "m=102400,t=2,p=8"
            var saltBase64 = parts[4];
            var hashBase64 = parts[5];

            // Parsear parámetros
            var parameters = paramsPart.Split(',');
            var memory = int.Parse(parameters[0].Split('=')[1]);
            var iterations = int.Parse(parameters[1].Split('=')[1]);
            var parallelism = int.Parse(parameters[2].Split('=')[1]);

            var salt = Convert.FromBase64String(FromBase64UrlSafe(saltBase64));
            var expectedHash = Convert.FromBase64String(FromBase64UrlSafe(hashBase64));

            // configurar Argon2 con los parámetros extraídos
            argon2Verifier.Salt = salt;
            argon2Verifier.DegreeOfParallelism = parallelism;
            argon2Verifier.Iterations = iterations;
            argon2Verifier.MemorySize = memory;

            // se genera hash con los mismos parámetros
            var computedHash = argon2Verifier.GetBytes(expectedHash.Length);

            return expectedHash.SequenceEqual(computedHash);
        }
        catch (Exception ex)
        {
            // Log del error para depuración
            Console.WriteLine($"Error verifying Argon2 standard format: {ex.Message}");
            return false;
        }
    }

    private bool VerifyLegacyFormat(string password, string hashedPassword)
    {
        var hashBytes = Convert.FromBase64String(hashedPassword);

        var salt = new byte[SaltSize];
        var hash = new byte[HashSize];
        Array.Copy(hashBytes, 0, salt, 0, SaltSize);
        Array.Copy(hashBytes, SaltSize, hash, 0, HashSize);

        var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            DegreeOfParallelism = Parallelism,
            Iterations = Iterations,
            MemorySize = Memory
        };

        var computedHash = argon2.GetBytes(HashSize);
        return hash.SequenceEqual(computedHash);
    }

    private static string FromBase64UrlSafe(string base64UrlSafe)
    {
        // Reemplazar caracteres URL-safe con caracteres Base64 estándar
        string base64 = base64UrlSafe.Replace('-', '+').Replace('_', '/');

        // Agregar padding si es necesario
        switch (base64.Length % 4)
        {
            case 2:
                base64 += "==";
                break;
            case 3:
                base64 += "=";
                break;
        }

        return base64;
    }

    
}

