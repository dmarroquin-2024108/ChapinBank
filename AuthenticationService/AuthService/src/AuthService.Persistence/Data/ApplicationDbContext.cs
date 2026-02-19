using System;
using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users {get; set;}
    public DbSet<Roles> Roles {get; set;}
    public DbSet<UserRole> UserRoles {get; set;}
    public DbSet<UserEmail> UserEmails {get; set;}
    public DbSet<UserPassReset> UserPasswordResets {get; set;}
    public DbSet<Account> Accounts {get; set;}

    public static string ToSnakeCase(string input)
    {
        if(string.IsNullOrEmpty(input))
            return input;

        return string.Concat(
            input.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + c : c.ToString())
        ).ToLower();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach(var entity in modelBuilder.Model.GetEntityTypes())
        {
            var tableName = entity.GetTableName();

            if (!string.IsNullOrEmpty(tableName))
            {
                entity.SetTableName(ToSnakeCase(tableName));
            }
            
            foreach(var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName();
                if (!string.IsNullOrEmpty(columnName))
                {
                    property.SetColumnName(ToSnakeCase(columnName));
                }
            }
            //conf de snake case para llaves primarias y foranes
            foreach(var key in entity.GetKeys())
            {
                var KeyName = key.GetName();
                if (!string.IsNullOrEmpty(KeyName))
                {
                    key.SetName(ToSnakeCase(KeyName));
                }
            }

            foreach(var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if (!string.IsNullOrEmpty(indexName))
                {
                    index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }

        }
        //lambda
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdUser);
            entity.Property(e => e.IdUser)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(25);
            entity.Property(e => e.Surname)
                .IsRequired()
                .HasMaxLength(25);
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(25);

            entity.Property(e => e.DPI)
                .IsRequired();
            entity.Property(e => e.Direction)
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(e => e.Phone)
                .IsRequired()
                .HasMaxLength(8);

            entity.Property(e => e.NameWork)
                .HasMaxLength(255);
            entity.Property(e => e.Email)
                .IsRequired();
            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.Status)
                .HasDefaultValue(true);
            entity.Property(e => e.SaldoActual)
                .HasColumnType("numeric(18,2)");
            entity.Property(e => e.IngresosMensuales)
                .HasColumnType("numeric(18,2)");
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();

            //son indices
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasMany(e => e.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId);
            entity.HasOne(e => e.UserEmail)
                .WithOne(up => up.User)
                .HasForeignKey<UserEmail>(up => up.IdUser);
            entity.HasOne(e => e.UserPasswordReset)
                .WithOne(up => up.User)
                .HasForeignKey<UserPassReset>(up => up.IdUser);

        });


        // config de Role
        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasKey(e => e.IdRole);
            entity.Property(e => e.IdRole)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasMany(e => e.UserRoles)
                .WithOne(r => r.Role)
                .HasForeignKey(r => r.RoleId);
        });

        // config de UserRole
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.IdUserRole);
            entity.Property(e => e.IdUserRole)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UserId)
                .HasMaxLength(16);
            entity.Property(e => e.RoleId)
                .HasMaxLength(16);
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);
            entity.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        });

        // config de UserEmail
        modelBuilder.Entity<UserEmail>(entity =>
        {
            entity.HasKey(e => e.IdEmail);
            entity.Property(e => e.IdEmail)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.IdUser)
                .HasMaxLength(16);
            entity.Property(e => e.EmailVerified).HasDefaultValue(false);
            entity.Property(e => e.EmailVerificationToken).HasMaxLength(256);
        });

        //conf del UserPassReset
        modelBuilder.Entity<UserPassReset>(entity =>
        {
            entity.HasKey(e => e.IdUserPass);
            entity.Property(e => e.IdUserPass)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.IdUser)
                .HasMaxLength(16);
            entity.Property(e => e.PasswordResetToken).HasMaxLength(256);
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.IdAccount);
            entity.Property(e => e.IdAccount)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.AccountNumber)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.AccountType)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.UserId)
                .HasMaxLength(16);
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId);
        });
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => (e.Entity is User || e.Entity is Roles || e.Entity is UserRole)
            && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach(var entry in entries)
        {
            if(entry.Entity is User user)
            {
                if(entry.State == EntityState.Added)
                {
                    user.CreatedAt = DateTime.UtcNow;
                }
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if(entry.Entity is Roles role)
            {
                if(entry.State == EntityState.Added)
                {
                    role.CreatedAt = DateTime.UtcNow;
                }
                role.UpdatedAt = DateTime.UtcNow;
            }
            else if(entry.Entity is UserRole userRole)
            {
                if(entry.State == EntityState.Added)
                {
                    userRole.CreatedAt = DateTime.UtcNow;
                }
                userRole.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }


}
