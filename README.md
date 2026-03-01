# ChapinBank — Sistema Bancario de Microservicios

ChapinBank es una plataforma bancaria backend construida con arquitectura de microservicios. Permite a los usuarios registrarse, autenticarse, gestionar cuentas bancarias, realizar depósitos y transferencias, comprar productos bancarios y recibir notificaciones en tiempo real.

---

## Arquitectura General

El sistema está compuesto por **3 microservicios independientes** que se comunican entre sí mediante HTTP (Axios). Comparten la misma clave secreta JWT para validar tokens entre servicios.

```
┌──────────────────────────────────────────────────────────────┐
│                        CHAPIN BANK                           │
│                                                              │
│  ┌─────────────────┐   ┌──────────────────┐   ┌──────────┐  │
│  │  Auth Service   │   │  Account Service │   │ Products │  │
│  │  .NET 8 / C#    │   │  Node.js / JS    │   │  Service │  │
│  │  Puerto: 5079   │   │  Puerto: 3010    │   │ Node.js  │  │
│  │  PostgreSQL      │   │  MongoDB         │   │ Puerto:  │  │
│  │                 │   │                  │   │  3015    │  │
│  └────────┬────────┘   └────────┬─────────┘   └────┬─────┘  │
│           │   JWT compartido    │                   │        │
│           └────────────────────┴───────────────────┘        │
│                                                              │
│  ┌───────────────────┐   ┌──────────────────────────────┐   │
│  │  PostgreSQL :5436 │   │      MongoDB :27017          │   │
│  │  (Auth DB)        │   │  (Accounts, Products, etc.)  │   │
│  └───────────────────┘   └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Tecnologías y Requisitos

### Globales
| Herramienta | Versión mínima | Uso |
|---|---|---|
| **Node.js** | 18+ | Runtime para Account y Products Service |
| **pnpm** | 10.x | Gestor de paquetes (reemplaza npm) |
| **.NET SDK** | 8.0 | Runtime para Auth Service |
| **MongoDB** | 6+ | Base de datos para Account y Products Service |
| **PostgreSQL** | 13 | Base de datos para Auth Service |
| **Docker** | Cualquier versión reciente | Para levantar PostgreSQL fácilmente |

### Por Servicio

#### Auth Service (C# / .NET 8)
- `Microsoft.AspNetCore.Authentication.JwtBearer` — Validación de JWT
- `Entity Framework Core` + `Npgsql` — ORM para PostgreSQL
- `Serilog` — Logging estructurado a consola y archivos
- `Swashbuckle` (Swagger) — Documentación de la API
- `FluentValidation` — Validación de DTOs
- `MailKit` — Envío de correos (SMTP Gmail)
- `Konscious.Security.Cryptography.Argon2` — Hashing de contraseñas
- `NetEscapades.AspNetCore.SecurityHeaders` — Cabeceras de seguridad

#### Account Service & Products Service (Node.js)
- `express` v5 — Framework HTTP
- `mongoose` — ODM para MongoDB
- `jsonwebtoken` — Validación de JWT
- `express-validator` — Validación de body/params
- `axios` — Comunicación HTTP entre servicios
- `helmet` — Cabeceras de seguridad HTTP
- `cors` — Control de orígenes
- `express-rate-limit` — Límite de peticiones
- `morgan` — Logger de peticiones HTTP
- `nodemon` — Recarga automática en desarrollo
- `uuid` — Generación de IDs únicos

---

## Configuración y Variables de Entorno

### Auth Service — `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=chapin_bank;Username=IN6AM;Password=...;Port=5436"
  },
  "JwtSettings": {
    "SecretKey": "<clave-secreta-compartida>",
    "Issuer": "ChapinBank",
    "Audience": "ChapinBank",
    "ExpirationMinutes": 60
  },
  "SmtpSettings": {
    "Host": "smtp.gmail.com",
    "Port": "465",
    "Username": "<correo>",
    "Password": "<app-password-gmail>"
  }
}
```

### Account Service — `.env`
```env
PORT=3010
URI_MONGODB=mongodb://localhost:27017/cbk-debuggers
JWT_SECRET=<misma-clave-que-auth-service>
JWT_ISSUER=ChapinBank
JWT_AUDIENCE=ChapinBank
JWT_EXPIRES_IN=1h
ACCOUNT_SERVICE_URL=http://localhost:3010
```

### Products Service — `.env`
```env
PORT=3015
URI_MONGODB=mongodb://localhost:27017/cbk-debuggers
JWT_SECRET=<misma-clave-que-auth-service>
JWT_ISSUER=ChapinBank
JWT_AUDIENCE=ChapinBank
JWT_EXPIRES_IN=1h
ACCOUNT_SERVICE_URL=http://localhost:3010/chapinbank/v1
```

> **Importante:** Los tres servicios deben compartir exactamente el mismo `JWT_SECRET` / `SecretKey` para que la validación de tokens entre servicios funcione correctamente.

---

## Instalación y Puesta en Marcha

### 1. Levantar PostgreSQL con Docker
```bash
cd ChapinBank/postgres
docker compose up -d
```

### 2. Auth Service
```bash
cd ChapinBank/AuthenticationService/AuthService
dotnet restore
dotnet ef database update   # aplica las migraciones
dotnet run --project src/AuthService.Api
# Disponible en: http://localhost:5079
# Swagger UI en: http://localhost:5079/swagger
```

### 3. Account Service
```bash
cd ChapinBank/AccountService/bank-movements-service
pnpm install
pnpm dev
# Disponible en: http://localhost:3010
```

### 4. Products Service
```bash
cd ChapinBank/products-service
pnpm install
pnpm dev
# Disponible en: http://localhost:3015
```

---

## Autenticación

Todos los servicios utilizan **JWT Bearer Token** con los mismos `issuer` y `audience` (`ChapinBank`). El token se obtiene haciendo login en el **Auth Service** y se envía en los siguientes formatos:

```
Authorization: Bearer <token>
// ó
x-token: <token>
```

Los roles disponibles son:
- `USER_ROLE` — Usuario estándar
- `ADMIN_ROLE` — Administrador
- `SUPERADMIN_ROLE` — Super administrador (puede crear admins)

---

## Endpoints por Servicio

### Auth Service — `http://localhost:5079/api/v1/auth`

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| `POST` | `/login` | ❌ | — | Iniciar sesión. Devuelve JWT. |
| `POST` | `/verify-email` | ❌ | — | Verificar cuenta con código enviado por email. |
| `POST` | `/resend-verification` | ❌ | — | Reenviar email de verificación. |
| `POST` | `/forgot-password` | ❌ | — | Envía email para recuperar contraseña. |
| `POST` | `/reset-password` | ❌ | — | Resetear contraseña con token de email. |
| `GET`  | `/profile` | ✅ | Cualquiera | Obtener perfil del usuario autenticado. |
| `POST` | `/profile/by-id` | ❌ | — | Obtener perfil de un usuario por ID (uso interno entre servicios). |
| `POST` | `/admin/create-user` | ✅ | ADMIN / SUPERADMIN | Crear un nuevo usuario desde el panel de administración. |

**Health check:** `GET http://localhost:5079/health`

---

### Account Service — `http://localhost:3010/chapinbank/v1`

#### Cuentas — `/accounts`
Todos los endpoints requieren autenticación JWT.

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/accounts` | ✅ | Crear una nueva cuenta (AHORRO o MONETARIA). Saldo inicial: Q20 ahorro / Q30 monetaria. |
| `GET`  | `/accounts` | ✅ | Listar todas las cuentas del usuario autenticado. |
| `GET`  | `/accounts/:accountNumber` | ✅ | Obtener una cuenta específica del usuario. |
| `PATCH`| `/accounts/:accountNumber` | ✅ | Actualizar datos de una cuenta. |
| `GET`  | `/accounts/internal/:accountNumber` | ✅ | Consultar cuenta por número (uso interno entre servicios). |
| `PATCH`| `/accounts/internal/:accountNumber` | ✅ | Actualizar balance de cuenta (uso interno entre servicios). |

#### Depósitos — `/deposits`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/deposits` | ✅ | Registrar un depósito en una cuenta. |

**Body esperado:**
```json
{
  "accountNumber": "AH1123456",
  "amount": 500.00,
  "currency": "GTQ",
  "depositMethod": "EFECTIVO",
  "description": "Depósito mensual"
}
```

#### Transferencias — `/transfers`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/transfers` | ✅ | Crear una transferencia (queda en estado PENDIENTE). Devuelve un `transferToken`. |
| `POST` | `/transfers/confirm` | ✅ | Confirmar o cancelar una transferencia pendiente. |

**Body para confirmar:**
```json
{
  "transferToken": "<token-de-transferencia>",
  "action": "ACEPTAR"   // o "CANCELAR"
}
```

#### Historial — `/history`

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| `GET`  | `/history/account/:accountNumber` | ✅ | Cualquiera | Ver historial de movimientos de una cuenta. |
| `GET`  | `/history/bank/movements` | ✅ | ADMIN | Ver todos los movimientos del banco. |
| `POST` | `/history/internal` | ✅ | — | Crear registro de historial (uso interno entre servicios). |

#### Notificaciones — `/notifications`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET`  | `/notifications/my` | ✅ | Obtener las notificaciones del usuario autenticado. |
| `PATCH`| `/notifications/:id/read` | ✅ | Marcar una notificación como leída. |

> Las notificaciones se generan automáticamente al completarse depósitos, transferencias u otras operaciones. No se crean manualmente.

**Health check:** `GET http://localhost:3010/chapinbank/v1/health`

---

### Products Service — `http://localhost:3015/chapinbank/v1`

#### Productos — `/products`

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| `GET`  | `/products` | ❌ | — | Listar todos los productos activos. |
| `GET`  | `/products/:id` | ❌ | — | Ver detalle de un producto. |
| `POST` | `/products` | ✅ | ADMIN | Crear un nuevo producto bancario. |
| `PUT`  | `/products/:id` | ✅ | ADMIN | Actualizar un producto existente. |
| `DELETE`| `/products/:id` | ✅ | ADMIN | Desactivar (soft delete) un producto. |

**Tipos de producto:** `SEGURO`, `VIAJE`, `SUSCRIPCION`

**Body para crear/actualizar:**
```json
{
  "name": "Seguro de vida",
  "description": "Cobertura completa para el titular",
  "type": "SEGURO",
  "price": 150.00
}
```

#### Transacciones — `/transactions`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/transactions/buy/:productId` | ✅ | Comprar un producto (se descuenta de la cuenta bancaria del usuario). |
| `GET`  | `/transactions/my-transactions` | ✅ | Ver historial de compras del usuario autenticado. |

**Health check:** `GET http://localhost:3015/chapinbank/v1/health`

---

## Modelos de Datos

### PostgreSQL — Auth Service

**Users:** `id`, `name`, `surname`, `username`, `dpi`, `direction`, `phone`, `email`, `passwordHash`, `requiresCambioPass`, `nameWork`, `status`, `createdAt`, `updatedAt`

**UserRoles:** Relación muchos a muchos entre `Users` y `Roles`

**UserEmail:** Token de verificación de correo por usuario

**UserPassReset:** Token para reset de contraseña por usuario

### MongoDB — Account & Products Services (base: `cbk-debuggers`)

**accounts:** `userId`, `accountNumber` (ej: `AH-XXXXXX` / `MO-XXXXXX`), `accountType` (AHORRO | MONETARIA), `balance`, `timestamps`

**deposits:** `accountNumber`, `userId`, `amount`, `currency`, `depositMethod`, `description`, `timestamps`

**transfers:** `noOperacion`, `numberAccountOrigin`, `numberAccountDestination`, `amount`, `status`, `transferToken`, `timestamps`

**history:** Registro de todos los movimientos por cuenta

**notifications:** Notificaciones automáticas por usuario

**products:** `name`, `description`, `type`, `price`, `isActive`, `timestamps`

**transactions:** Registro de compras de productos por usuario

---

## Seguridad

- **Argon2** para hashing de contraseñas (Auth Service)
- **Helmet** en todos los servicios Node.js para cabeceras HTTP seguras
- **Rate limiting** en todos los servicios para prevenir abuso
- **CORS** configurado explícitamente (localhost:3000 y 3001 por defecto)
- **JWT** con issuer/audience validados en todos los servicios
- **Verificación de email** obligatoria antes de poder operar
- **Serilog** para auditoría de logs con rotación diaria (30 días de retención)

---

## Estructura del Proyecto

```
ChapinBank/
├── AuthenticationService/
│   └── AuthService/                  # Servicio de autenticación (.NET 8)
│       └── src/
│           ├── AuthService.Api/      # Controllers, middlewares, configuración
│           ├── AuthService.Application/ # DTOs, servicios, interfaces
│           ├── AuthService.Domain/   # Entidades, enums, contratos de repositorio
│           └── AuthService.Persistence/ # DbContext, repositorios, migraciones
│
├── AccountService/
│   └── bank-movements-service/       # Servicio de cuentas y movimientos (Node.js)
│       ├── configs/                  # DB, CORS, Helmet, Rate limit
│       ├── middlewares/              # JWT, validadores, errores
│       └── src/
│           ├── accounts/             # CRUD de cuentas bancarias
│           ├── deposits/             # Registro de depósitos
│           ├── transfers/            # Transferencias entre cuentas
│           ├── history/              # Historial de movimientos
│           └── notifications/        # Notificaciones de usuario
│
├── products-service/                 # Servicio de productos bancarios (Node.js)
│   ├── configs/
│   ├── middlewares/
│   └── src/
│       ├── Products/                 # CRUD de productos
│       └── Transactions/             # Compras de productos
│
└── postgres/
    └── docker-compose.yml            # PostgreSQL en Docker
```

---

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

Proyecto base desarrollado por:Braulio Echeverría Curso IN6AM - Kinal Guatemala 2026

Repositorio Original: https://github.com/IN6AMProm33/auth-service-dotnet.git

Este proyecto fue utilizado como referencia académica y posteriormente adaptado y modificado.

---