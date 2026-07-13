using System;
using AuthService.Application.Interfaces;
using AuthService.Application.Services;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using AuthService.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace AuthService.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = BuildSupabaseConnectionString(configuration);

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IAuthService,  Application.Services.AuthService>();
        services.AddScoped<IUserManagementService, UserManagementService>();
        services.AddScoped<IPassHashService, PasswordHashService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        
        services.AddHealthChecks();
        return services;
    }

    private static string BuildSupabaseConnectionString(IConfiguration configuration)
    {
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = configuration["Supabase:Host"],
            Port = int.Parse(configuration["Supabase:Port"] ?? "5432"),
            Database = configuration["Supabase:Database"],
            Username = configuration["Supabase:Username"],
            Password = configuration["Supabase:Password"],
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };
        return builder.ConnectionString;
    }

    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        return services;
    }
}
