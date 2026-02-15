# ChapinBank - Gestion Bancaria

>**Nota**: Este proyecto está basado en un trabajo con nombre "Kinal Sports" desarrollado por Braulio Echeverría para el curso IN6AM - Kinal Guatemala. Se realizaron modificaciones con fines educativos.

## Descripción

El Authentication Service de ChapinBank es el encargado de gestionar la autenticación, autorización y administración de usuarios dentro del sistema bancario. Este servicio maneja el Registro de clientes y administradores, Recuperación y restablecimiento de contraseña, Gestión de roles, Protección de rutas seguras.

Implementa arquitectura limpia (Clean Architecture) con capas bien definidas: API, Application, Domain y Persistence.

## Funcionalidades Principales

### Autenticación
- Registro de usuario
- Inicio de sesión con generación de JWT
- Validación de credenciales
- Recuperación de contraseña
- Restablecimiento de contraseña

### Autorización
- Sistema de roles (Admin / Cliente)
- Control de acceso basado en permisos
- Protección de endpoints con JWT Bearer

### Seguridad
- Hash seguro de contraseñas (Argon2)
- Validación de issuer y audience en JWT
- Rate limiting por endpoint
- Headers de seguridad (HSTS, XSS, etc.)
- Manejo global de excepciones
- Logging estructurado

## Tecnologías Utilizadas

### Backend
- **Framework**: ASP.NET Core 8.0
- **Lenguaje**: C# (.NET 8)
- **Arquitectura**: Clean Architecture (4 capas)

### Base de Datos
- **ORM**: Entity Framework Core 9.0
- **Base de Datos**: PostgreSQL
- **Migraciones**: EF Core Migrations
- **Naming Convention**: Snake case (EFCore.NamingConventions)

### Seguridad
- **JWT**: System.IdentityModel.Tokens.Jwt
- **Hashing**: Argon2 (Konscious.Security.Cryptography.Argon2)
- **Arquitectura**: Clean Architecture

### Validación y Logging
- **Validación**: FluentValidation
- **Logging**: Serilog.AspNetCore
- **Documentación**: Swashbuckle.AspNetCore (Swagger)

## Endpoints API

Base URL: `http://localhost:5079/api/v1`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/login` | Inicio de sesión y obtención de token | No |
| `POST` | `/auth/admin/create-user` | Creación de clientes por Admin/SuperAdmin | Si(admin) |
| `POST` | `/auth/verify-email` | Confirma cuenta mediante token | No |
| `POST` | `/auth/forgot-password` | Solicitar recuperación de cuenta | No |
| `POST` | `/auth/reset-password` | Establecer nueva contraseña, en el momento de hacer login(ya que la contraseña enviada será temporal y el cliente tendrá que cambiarlo) y cuando se le olvidé su contraseña | No |

### Salud (`/health`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Estado del servicio | No |

### Modelos de Request

#### CreateUserByAdmin (`/auth/register`)
```json
{
    "name": "Eduardo",
    "surname": "Pérez",
    "username": "eperez",
    "email": "estuardogomez6b@gmail.com",
    "password": "admin1234",
    "role": "ADMIN_ROLE"
}
```

#### Login (`/auth/login`)
```json
{
    "EmailOrUsername": "superadmin",
    "Password": "SuperAdmin!"
}
```

#### ActiveUser (`/auth/active-user`)
```json
{
    "Token": "CLdiuakIkH9RC2Lj4H0zvKIUFSFHDzBl7ZpKEWPI2UY"
}
```

#### ForgoPass (`/auth/forgot-password`)
```json
{
    "email": "estuardogomez6b@gmail.com"
}
```

#### Restablecimiento de Contraseña (`/auth/reset-password`)
```json
{
    "token": "SimI78iDMagr7l_wcyFd0eem-GJVVe67h2vlbDEOzq8",
    "password": "MiClaveSegura456",
    "NewPassword": "MiClaveSegura456"
}
```

## 📁 Estructura del Proyecto

```
chapinbank-auth-service/
├── src/
│   ├── AuthService.Api/                      # Capa de presentación (API REST)
│   │   ├── Controllers/                     # Controladores REST (endpoints)
│   │   │   ├── AuthController.cs            # Login, registro, autenticación JWT
│   │   │   └── HealthController.cs          # Verificación de estado del servicio
│   │   │
│   │   ├── Extensions/                      # Configuración de servicios y seguridad
│   │   │   ├── AuthenticationExtensions.cs  # Configuración JWT y autenticación
│   │   │   ├── RateLimitingExtensions.cs    # Configuración limitación de peticiones
│   │   │   ├── SecurityExtensions.cs        # Configuración de seguridad
│   │   │   └── ServiceCollectionExtension.cs # Registro de dependencias (DI)
│   │   │
│   │   ├── Middlewares/                     # Middlewares personalizados
│   │   │   └── GlobalExceptionMiddleware.cs # Manejo global de excepciones
│   │   │
│   │   ├── Models/                          # Modelos de respuesta de la API
│   │   │   └── ErrorResponse.cs             # Modelo estándar de errores
│   │   │
│   │   ├── keys/                            # Claves criptográficas
│   │   │   └── key-xxxx.xml                 # Clave de protección de datos
│   │   │
│   │   ├── logs/                            # Archivos de registro del sistema
│   │   │   └── auth-service.txt             # Registro de eventos
│   │   │
│   │   ├── appsettings.json                 # Configuración principal
│   │   ├── appsettings.Development.json     # Configuración de desarrollo
│   │   ├── AuthService.Api.csproj           # Archivo de proyecto API
│   │   └── Program.cs                       # Punto de entrada de la aplicación
│   │
│   ├── AuthService.Application/             # Capa de aplicación (lógica de negocio)
│   │   ├── DTOs/                            # Objetos de transferencia de datos
│   │   │   ├── LoginDto.cs
│   │   │   ├── RegisterDto.cs
│   │   │   ├── RegisterResponseDto.cs
│   │   │   ├── AuthResponseDto.cs
│   │   │   ├── UserResponseDto.cs
│   │   │   ├── UserDetailsDto.cs
│   │   │   ├── GetProfileByIdDto.cs
│   │   │   ├── UpdateUserRoleDto.cs
│   │   │   ├── AdminCreateUserDto.cs
│   │   │   │
│   │   │   └── Email/                       # DTOs relacionados con email
│   │   │       ├── ForgotPasswordDto.cs
│   │   │       ├── ResetPasswordDto.cs
│   │   │       ├── VerifyEmailDto.cs
│   │   │       ├── ResendVerificationDto.cs
│   │   │       └── EmailResponseDto.cs
│   │   │
│   │   ├── Interfaces/                      # Interfaces de servicios
│   │   │   ├── IAuthService.cs
│   │   │   ├── IUserManagementService.cs
│   │   │   ├── IJwtTokenService.cs
│   │   │   ├── IPassHashService.cs
│   │   │   └── IEmailService.cs
│   │   │
│   │   ├── Services/                        # Implementación de servicios
│   │   │   ├── AuthService.cs               # Servicio de autenticación
│   │   │   ├── UserManagementService.cs    # Gestión de usuarios
│   │   │   ├── JwtTokenService.cs          # Generación de tokens JWT
│   │   │   ├── PasswordHashService.cs      # Hash de contraseñas
│   │   │   ├── EmailService.cs             # Servicio de correo electrónico
│   │   │   ├── TokenGenerator.cs           # Generación de tokens
│   │   │   └── IdGenerator.cs              # Generador de identificadores
│   │   │
│   │   ├── Exceptions/                     # Excepciones personalizadas
│   │   │   ├── BusinessException.cs
│   │   │   └── ErrorCode.cs
│   │   │
│   │   ├── Extensions/                     # Extensiones y utilidades
│   │   │   └── LoggerExtensions.cs
│   │   │
│   │   │
│   │   └── AuthService.Application.csproj  # Archivo de proyecto Application
│   │
│   ├── AuthService.Domain/                 # Capa de dominio (núcleo del sistema)
│   │   ├── Constants/                      # Constantes del dominio
│   │   │   └── RoleConstants.cs
│   │   │
│   │   ├── Entities/                       # Entidades del dominio
│   │   │   ├── User.cs                     # Entidad usuario
│   │   │   ├── Roles.cs                    # Entidad rol
│   │   │   ├── UserRole.cs                 # Relación usuario-rol
│   │   │   ├── UserEmail.cs                # Entidad email usuario
│   │   │   └── UserPassReset.cs            # Reset de contraseña
│   │   │
│   │   ├── Enums/                          # Enumeraciones
│   │   │   └── UserRole.cs
│   │   │
│   │   ├── Interfaces/                     # Interfaces de repositorios
│   │   │   ├── IUserRepository.cs
│   │   │   └── IRoleRepository.cs
│   │   │
│   │   └── AuthService.Domain.csproj       # Archivo de proyecto Domain
│   │
│   └── AuthService.Persistence/            # Capa de persistencia (acceso a datos)
│       ├── Data/                           # DbContext y configuración
│       │   ├── ApplicationDbContext.cs     # Contexto de base de datos EF Core
│       │   └── DataSeeder.cs               # Datos iniciales
│       │
│       ├── Migrations/                     # Migraciones EF Core
│       │   ├── InitialAdded.cs
│       │   └── ApplicationDbContextModelSnapshot.cs
│       │
│       ├── Repositories/                   # Implementación de repositorios
│       │   ├── UserRepository.cs
│       │   └── RoleRepository.cs
│       │
│       └── AuthService.Persistence.csproj  # Archivo de proyecto Persistence
│
├── postgres/
│   └── docker-compose.yml                  # Configuración PostgreSQL con Docker
│
├── AuthService.sln                         # Solución de Visual Studio
├── global.json                             # Configuración SDK .NET
├── .gitignore                              # Archivos ignorados por git
└── README.md                               # Documentación del proyecto```

## Configuración

### Requisitos Previos
- .NET 8.0 SDK o superior
- PostgreSQL 13 o superior
- Cuenta de Gmail con App Password (para envío de emails)

### Variables de Configuración

Crear `appsettings.Development.json` en `src/AuthService.Api/`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=chapin_bank;Username=IN6AM;Password=Admin!;Port=5436"
  },
  "SmtpSettings":{
    "Host":"smtp.gmail.com",
    "Port":"465",
    "EnableSsl":"true",
    "Username":"debuggersinam@gmail.com",
    "Password":"oqyvsnbqmiospenl",
    "FromEmail":"debuggersinam@gmail.com",
    "FromName":"Chapin Bank Soporte",
    "Enabled":true,
    "Timeout":10000,
    "UseFallback":false,
    "UseImplicitSsl":true
  },
  "JwtSettings":{
    "SecretKey": "MiLLaveSuperSeceretaParaJWT2021272y2021001",
    "Issuer": "ChapinBank",
    "Audience": "ChapinBank",
    "ExpirationMinutes": 60
  },
  "AppSettigs":
  {
    "FontendUrl": "http://localhost:3000",
    "IgnoreCertificateErrors": true
  },
  "Security": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3000",
      "https://localhost:3001"
    ],
    "AdminAllowedOrigins": [
      "http://localhost:3000"
    ],
    "BlacklistedIPs": [],
    "WhitelistedIPs": [],
    "RestrictedPaths": []
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Serilog": {
    "Using": [
      "Serilog.Sinks.Console",
      "Serilog.Sinks.File"
    ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.Hosting.Lifetime": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "Console",
        "Args": {
          "outputTemplate": "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      },
      {
        "Name": "File",
        "Args": {
          "path": "logs/auth-service-.txt",
          "rollingInterval": "Day",
          "outputTemplate": "[{Timestamp:yyyy-MM-dd HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}",
          "retainedFileCountLimit": 30
        }
      }
    ],
    "Enrich": [
      "FromLogContext"
    ]
  },
  "AllowedHosts": "*"
}
```

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd auth-service
```

2. **Restaurar dependencias**
```bash
dotnet restore
```

3. **Aplicar migraciones a la base de datos**
```bash
cd src/AuthService.Api
dotnet ef database update
```

4. **compilar el proyecto**
```bash
dotnet build
```

5. **ejecutar el servicio**
```bash
dotnet run
```

El servicio estará disponible en: `http://localhost:5079`

### Documentación Swagger/OpenAPI

La documentación interactiva de la API está disponible en:

- **Interfaz Swagger UI**: `http://localhost:5079/swagger`
- **Especificación JSON**: `http://localhost:5079/swagger/v1/swagger.json`

Ingresa a Swagger para visualizar todos los endpoints disponibles, consultar ejemplos de solicitudes y respuestas, y realizar pruebas de la API directamente desde el navegador.

## Seguridad

### Rate Limiting
- **AuthPolicy**: 5 solicitudes / 1 minuto (registro, login)
- **ApiPolicy**: 20 solicitudes / 1 minuto (endpoints generales)

### Headers de Seguridad
- HSTS (HTTP Strict Transport Security)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: no-referrer

### Almacenamiento de Claves
- Las claves de encriptación se almacenan en `keys/`
- Nunca se deben commitear al repositorio
- Configurar en `.gitignore` apropiadamente

### JWT
- Tokens con tiempo de expiración configurable
- Validación de issuer y audience
- Almacenamiento seguro de claves

## Logging

Los logs se almacenan en:
- **Consola**: Formato simplificado para desarrollo
- **Archivos**: `logs/auth-service-YYYY-MM-DD.txt` (rotación diaria)
- **SMTP Protocol**: `logs/smtp-protocol.log` (cuando está habilitado)

Configuración:
- **Retención**: 30 días
- **Nivel mínimo**: Information en desarrollo
- **Formato**: JSON estructurado en archivos

## Desarrollo

### Crear una nueva migración
```bash
cd src/AuthService.Api
dotnet ef migrations add NombreDeLaMigracion
dotnet ef database update
```

### Ejecutar pruebas HTTP
El archivo `src/AuthService.Api/AuthService.Api.http` contiene ejemplos de solicitudes HTTP para probar los endpoints localmente.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**Los Debuggers**  
Curso IN6AM - Kinal Guatemala 2026

## Microservicios Relacionados

Este servicio es parte de la arquitectura de microservicios de ChapinBank:
- **Authentication Service** (este repositorio)
- Users Management Service
- Notifications Service
- API Gateway

---

**Nota**: Este proyecto fue desarrollado con fines académicos como parte del proceso de aprendizaje sobre arquitectura de microservicios. No se recomienda su uso en entornos de producción sin realizar previamente las validaciones, pruebas y auditorías de seguridad correspondientes.


## Créditos

Proyecto base desarrollado por:
Braulio Echeverría
Curso IN6AM - Kinal Guatemala 2026

Repositorio Original:
https://github.com/IN6AMProm33/auth-service-dotnet.git

Este proyecto fue utilizado como referencia académica y posteriormente adaptado y modificado.