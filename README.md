# ChapinBank - Gestion Bancaria

>**Nota**: Este proyecto está basado en un trabajo con nombre "Kinal Sports" desarrollado por Braulio Echeverría para el curso IN6AM - Kinal Guatemala. Se realizaron modificaciones con fines educativos.

**Nota**:
Link de Tablero de Trello:
https://trello.com/invite/b/6973adeccd9207eab84a5ce7/ATTIec2272ff322f6b1ba95e92588739b0248479AF1E/sistema-bancario

Link de documento de Evidencia de Reuniones y Participación del Grupo:
https://cetkinal-my.sharepoint.com/:b:/g/personal/dmarroquin-2024108_kinal_edu_gt/IQD6A_LtomI2RpdUy-HKvTBzAagzpoUvij8KkRh7xrOPzcM?e=QYk9MV

ChapinBank es una plataforma bancaria construida con arquitectura de microservicios. Permite a los usuarios registrarse, autenticarse, gestionar cuentas bancarias, realizar depósitos y transferencias, comprar productos bancarios, gestionar cuentas favoritas y recibir notificaciones en tiempo real. Incluye un cliente web administrativo para la gestión del sistema.

---

## Arquitectura General

El sistema está compuesto por **3 microservicios independientes** y **1 cliente web (React)** que se comunican entre sí mediante HTTP (Axios). Comparten la misma clave secreta JWT para validar tokens entre servicios.

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
- `nodemailer` — Envío de correos (Account Service)
- `swagger-jsdoc` + `swagger-ui-express` — Documentación de la API (Swagger)

#### Products Service (adicional)
- `cloudinary` — Almacenamiento de imágenes en la nube
- `multer` + `multer-storage-cloudinary` — Subida de imágenes de productos

#### Client Admin (React + Vite)
- `react` v19 + `react-dom` — Framework UI
- `vite` v8 — Bundler y servidor de desarrollo
- `react-router-dom` v7 — Enrutamiento
- `zustand` — Manejo de estado global
- `axios` — Comunicación con los servicios
- `tailwindcss` v4 — Estilos
- `react-hook-form` — Manejo de formularios
- `react-hot-toast` — Notificaciones en UI
- `lucide-react` + `@heroicons/react` — Íconos
- `@material-tailwind/react` — Componentes UI

---

## Configuración y Variables de Entorno

### Auth Service — `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=chapin_bank;Username=IN6AM;Password=Admin!;Port=5436"
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
    "Password": "<app-password-gmail>",
    "FromEmail": "<correo>",
    "FromName": "Chapin Bank Soporte"
  },
  "AppSettings": {
    "FrontendUrl": "http://localhost:5173"
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
AUTH_SERVICE_URL=http://localhost:5079

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<correo>
SMTP_PASS=<app-password-gmail>
SMTP_FROM_NAME=Chapin Bank
SMTP_FROM_EMAIL=<correo>

TRANSFER_CANCEL_WINDOW_MINUTES=30
DEPOSIT_REVERT_LIMIT_MS=60000
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

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### Client Admin — `.env`
```env
VITE_AUTH_URL=http://localhost:5079/api/v1
VITE_ACCOUNT_URL=http://localhost:3010/chapinbank/v1
VITE_PRODUCT_URL=http://localhost:3015/chapinbank/v1
```

> **Importante:** Los tres servicios deben compartir exactamente el mismo `JWT_SECRET` / `SecretKey` para que la validación de tokens entre servicios funcione correctamente.

---

## Instalación y Puesta en Marcha

### Opción A — Levantar todo desde la raíz (recomendado)
```bash
# Instalar dependencias de todos los servicios y el cliente
pnpm run install:all

# Levantar todos los servicios simultáneamente
pnpm start
```

> Este comando usa `concurrently` para iniciar Auth Service, Account Service, Products Service y el Client Admin en paralelo con salida coloreada por servicio.

### Opción B — Levantar cada servicio manualmente

#### 1. Levantar PostgreSQL con Docker
```bash
cd ChapinBank/postgres
docker compose up -d
```

#### 2. Auth Service
```bash
cd ChapinBank/AuthenticationService/AuthService
dotnet restore
dotnet ef database update   # aplica las migraciones
dotnet run --project src/AuthService.Api
# Disponible en: http://localhost:5079
# Swagger UI en: http://localhost:5079/swagger
```

#### 3. Account Service
```bash
cd ChapinBank/AccountService
pnpm install
pnpm dev
# Disponible en: http://localhost:3010
# Swagger UI en: http://localhost:3010/chapinbank/v1/api-docs
```

#### 4. Products Service
```bash
cd ChapinBank/products-service
pnpm install
pnpm dev
# Disponible en: http://localhost:3015
# Swagger UI en: http://localhost:3015/chapinbank/v1/api-docs
```

#### 5. Client Admin
```bash
cd ChapinBank/client-admin
pnpm install
pnpm dev
# Disponible en: http://localhost:5173
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

El Auth Service también maneja **Refresh Tokens** para renovación de sesión sin necesidad de volver a autenticarse.

---

## Endpoints por Servicio

### Auth Service — `http://localhost:5079/api/v1/auth`

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| `POST` | `/login` | ❌ | — | Iniciar sesión. Devuelve JWT y refresh token. |
| `POST` | `/refresh` | ❌ | — | Renovar token de acceso con un refresh token. |
| `POST` | `/logout` | ✅ | Cualquiera | Cerrar sesión. Revoca el refresh token. |
| `POST` | `/verify-email` | ❌ | — | Verificar cuenta con código enviado por email. |
| `POST` | `/resend-verification` | ❌ | — | Reenviar email de verificación. |
| `POST` | `/forgot-password` | ❌ | — | Envía email para recuperar contraseña. |
| `POST` | `/reset-password` | ❌ | — | Resetear contraseña con token de email. |
| `POST` | `/change-temp-password` | ✅ | Cualquiera | Cambiar contraseña temporal por una definitiva. |
| `GET`  | `/profile` | ✅ | Cualquiera | Obtener perfil del usuario autenticado. |
| `PATCH`| `/me` | ✅ | Cualquiera | Actualizar perfil del usuario autenticado. |
| `POST` | `/me/request-delete` | ✅ | Cualquiera | Solicitar eliminación de cuenta propia (envía token por email). |
| `POST` | `/me/confirm-delete` | ✅ | Cualquiera | Confirmar eliminación de cuenta propia con token. |
| `POST` | `/profile/by-id` | ✅ | — | Obtener perfil de un usuario por ID (uso interno entre servicios). |
| `POST` | `/admin/create-user` | ✅ | ADMIN / SUPERADMIN | Crear un nuevo usuario desde el panel de administración. |
| `GET`  | `/admin/users` | ✅ | ADMIN / SUPERADMIN | Listar todos los usuarios del sistema. |
| `GET`  | `/admin/users/summary` | ✅ | ADMIN / SUPERADMIN | Resumen de usuarios: total, activos, inactivos y los 5 más recientes. |
| `DELETE`| `/admin/users/:userId` | ✅ | ADMIN / SUPERADMIN | Soft delete de un usuario. |

**Health check:** `GET http://localhost:5079/health`

---

### Account Service — `http://localhost:3010/chapinbank/v1`

#### Cuentas — `/accounts`
Todos los endpoints requieren autenticación JWT.

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| `POST` | `/accounts` | ✅ | Cualquiera | Crear una nueva cuenta (AHORRO o MONETARIA). |
| `GET`  | `/accounts` | ✅ | Cualquiera | Listar todas las cuentas del usuario autenticado. |
| `GET`  | `/accounts/:accountNumber` | ✅ | Cualquiera | Obtener una cuenta específica del usuario. |
| `PATCH`| `/accounts/:accountNumber` | ✅ | Cualquiera | Actualizar datos de una cuenta. |
| `GET`  | `/accounts/account-internal/:accountNumber` | ✅ | — | Consultar cuenta por número (uso interno entre servicios). |
| `PATCH`| `/accounts/account-internal/:accountNumber` | ✅ | — | Actualizar balance de cuenta (uso interno entre servicios). |
| `GET`  | `/accounts/admin/summary` | ✅ | ADMIN / SUPERADMIN | Resumen de cuentas: total, activas, inhabilitadas y saldo total del banco. |
| `GET`  | `/accounts/admin/all` | ✅ | ADMIN / SUPERADMIN | Listar todas las cuentas del banco. |
| `PATCH`| `/accounts/admin/:accountNumber/status` | ✅ | ADMIN / SUPERADMIN | Activar o desactivar una cuenta. |

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

#### Favoritos — `/favorites`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/favorites` | ✅ | Agregar una cuenta a favoritos con un alias. |
| `GET`  | `/favorites` | ✅ | Obtener todas las cuentas favoritas del usuario. |
| `GET`  | `/favorites/:id` | ✅ | Obtener un favorito específico por su ID. |
| `PATCH`| `/favorites/:id` | ✅ | Actualizar el alias de un favorito. |
| `DELETE`| `/favorites/:id` | ✅ | Eliminar un favorito. |

**Body para agregar favorito:**
```json
{
  "accountNumber": "AH0000002",
  "alias": "María - Ahorro"
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
| `POST` | `/products` | ✅ | ADMIN / SUPERADMIN | Crear un nuevo producto bancario. |
| `PUT`  | `/products/:id` | ✅ | ADMIN / SUPERADMIN | Actualizar un producto existente. |
| `DELETE`| `/products/:id` | ✅ | ADMIN / SUPERADMIN | Desactivar (soft delete) un producto. |
| `POST` | `/products/:id/image` | ✅ | ADMIN / SUPERADMIN | Subir o reemplazar la imagen de un producto (Cloudinary). |

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

**RefreshToken:** Tokens de refresco de sesión por usuario

### MongoDB — Account & Products Services (base: `cbk-debuggers`)

**accounts:** `userId`, `accountNumber` (ej: `AH-XXXXXX` / `MO-XXXXXX`), `accountType` (AHORRO | MONETARIA), `balance`, `isActive`, `timestamps`

**deposits:** `accountNumber`, `userId`, `amount`, `currency`, `depositMethod`, `description`, `timestamps`

**transfers:** `noOperacion`, `numberAccountOrigin`, `numberAccountDestination`, `amount`, `status`, `transferToken`, `timestamps`

**favorites:** `userId`, `accountNumber`, `accountType`, `alias`, `timestamps`

**history:** Registro de todos los movimientos por cuenta

**notifications:** Notificaciones automáticas por usuario

**products:** `name`, `description`, `type`, `price`, `imageUrl`, `isActive`, `timestamps`

**transactions:** Registro de compras de productos por usuario

---

## Seguridad

- **Argon2** para hashing de contraseñas (Auth Service)
- **Refresh Tokens** con rotación automática para renovación segura de sesiones
- **Helmet** en todos los servicios Node.js para cabeceras HTTP seguras
- **Rate limiting** en todos los servicios para prevenir abuso
- **CORS** configurado explícitamente (localhost:3000 y 3001 por defecto)
- **JWT** con issuer/audience validados en todos los servicios
- **Verificación de email** obligatoria antes de poder operar
- **Serilog** para auditoría de logs con rotación diaria (30 días de retención)
- **Cloudinary** para almacenamiento seguro de imágenes de productos

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
├── AccountService/                   # Servicio de cuentas y movimientos (Node.js)
│   ├── configs/                      # DB, CORS, Helmet, Rate limit, Swagger
│   ├── helpers/                      # Email, moneda, estado de cuenta
│   ├── middlewares/                  # JWT, validadores, errores
│   └── src/
│       ├── accounts/                 # CRUD de cuentas bancarias
│       ├── deposits/                 # Registro de depósitos
│       ├── favorite/                 # Cuentas favoritas del usuario
│       ├── transfers/                # Transferencias entre cuentas
│       ├── history/                  # Historial de movimientos
│       └── notifications/            # Notificaciones de usuario
│
├── products-service/                 # Servicio de productos bancarios (Node.js)
│   ├── configs/                      # DB, CORS, Helmet, Rate limit, Cloudinary, Swagger
│   ├── helpers/                      # Precios
│   ├── middlewares/
│   └── src/
│       ├── Products/                 # CRUD de productos + subida de imágenes
│       └── Transactions/             # Compras de productos
│
├── client-admin/                     # Cliente web administrativo (React + Vite)
│   └── src/
│       ├── app/                      # Rutas, layouts, punto de entrada
│       ├── features/                 # Módulos por funcionalidad (auth, accounts, products, etc.)
│       └── shared/                   # APIs, componentes y utilidades compartidas
│
├── postgres/
│   └── docker-compose.yml            # PostgreSQL en Docker
│
└── package.json                      # Script raíz para levantar todo con concurrently
```

---

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**Los Debuggers**  
Curso IN6AM - Kinal Guatemala 2026

---

**Nota**: Este proyecto fue desarrollado con fines académicos como parte del proceso de aprendizaje sobre arquitectura de microservicios. No se recomienda su uso en entornos de producción sin realizar previamente las validaciones, pruebas y auditorías de seguridad correspondientes.


## Créditos

Proyecto base desarrollado por:
Braulio Echeverría
Curso IN6AM - Kinal Guatemala 2026

Repositorio Original:
https://github.com/IN6AMProm33/auth-service-dotnet.git

**NOTA** 
Este proyecto fue utilizado como referencia académica y posteriormente adaptado y modificado.

## Referencias

| Tecnología | Documentación |
|------------|---------------|
| JWT | [jwt.io](https://jwt.io/introduction) |
| Axios | [axios-http.com](https://axios-http.com/docs/intro) |
| RFC 6750 Bearer Token | [ietf.org](https://datatracker.ietf.org/doc/html/rfc6750) |
| Cloudinary | [cloudinary.com](https://cloudinary.com/documentation) |
| Vite | [vite.dev](https://vite.dev/) |
| Zustand | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs/) |

---