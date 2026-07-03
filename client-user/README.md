# ChapinBank Client User - React Native (Expo)

Proyecto React Native con Expo para la migración de client-admin de ChapinBank.

## Estructura del Proyecto

```
src/
├── features/              # Módulos de negocio (auth, deposits, transfers, etc.)
│   └── <feature>/
│       ├── screens/       # Pantallas del feature
│       ├── components/    # Componentes específicos del feature
│       ├── hooks/         # Hooks de datos del feature
│       └── store/         # Store de Zustand del feature (si aplica)
├── navigation/            # Navegación de la app
│   ├── AppNavigator.jsx   # Navegador principal
│   ├── AuthStack.jsx      # Stack de autenticación
│   ├── UserTabs.jsx       # Tabs de usuario (7 tabs)
│   └── AdminStack.jsx     # Stack de administración (5 secciones)
├── shared/
│   ├── api/               # Clientes API por microservicio
│   │   ├── authClient.js
│   │   ├── accountsClient.js
│   │   └── productClient.js
│   ├── constants/         # Constantes globales
│   │   ├── theme.js       # Colores, spacing, fuentes, sombras
│   │   └── endpoints.js   # Endpoints de API
│   ├── components/common/ # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Avatar.jsx
│   │   └── Toast.jsx
│   ├── store/             # Stores globales
│   │   └── authStore.js   # Store de autenticación
│   └── utils/             # Utilidades
│       ├── errorMessage.js
│       └── toast.js
```

## Instalación de Dependencias

```bash
# Instalar dependencias base
pnpm install

# Instalar dependencias adicionales si faltan
pnpm add expo @expo-google-fonts/poppins expo-font
```

## Comandos de Ejecución

```bash
# Iniciar el servidor de desarrollo
pnpm start

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios

# Ejecutar en web
pnpm web
```

## Variables de Entorno

El archivo `.env` contiene las URLs de los microservicios:

```
EXPO_PUBLIC_AUTH_URL=http://localhost:5079/api/v1
EXPO_PUBLIC_ACCOUNT_URL=http://localhost:3010/chapinbank/v1
EXPO_PUBLIC_PRODUCT_URL=http://localhost:3015/chapinbank/v1
```

## Paleta de Colores (ChapinBank)

- **primary**: #032340 (azul marino - fondo de sidebar/navbar)
- **primaryDark**: #0d1f35 (azul más oscuro - títulos importantes)
- **accent**: #F28C00 (naranja - color de acción principal)
- **accentPressed**: #c07018 (naranja oscuro - estado pressed)
- **gold**: #FFBB00 (dorado - acentos secundarios)
- **background**: #f5f3ef (fondo general - tono crema)
- **surface**: #ffffff (fondo de cards/modales)
- **textPrimary**: #0d1f35
- **textSecondary**: #6b7280
- **border**: #e5e7eb
- **success**: #16a34a
- **error**: #ef4444
- **info**: #0ea5e9
- **warning**: #f59e0b

## Roles de Usuario

- **USER_ROLE**: Navega en tabs de usuario (Inicio, Depósitos, Transferencias, Historial, Productos, Mis Productos, Favoritos)
- **ADMIN_ROLE**: Navega en stack de administración (Resumen, Productos, Usuarios, Cuentas, Historial)
- **SUPERADMIN_ROLE**: Navega en stack de administración (mismas secciones que ADMIN_ROLE)

## Estado Actual

✅ Esqueleto base completado:
- Configuración de Expo con dependencias base
- Estructura de carpetas por features
- Theme con paleta de colores ChapinBank
- Endpoints de API (AUTH, ACCOUNT, PRODUCT)
- Clientes API con interceptores y refresh token
- AuthStore con login, logout, y acciones de autenticación
- Componentes comunes (Button, Input, Card, ConfirmModal, EmptyState, LoadingSpinner, Avatar)
- Toast personalizado con 4 estados (success, error, info, warning)
- Navegación base (AuthStack, UserTabs, AdminStack)
- Guard de roles (USER_ROLE vs ADMIN_ROLE/SUPERADMIN_ROLE)

🚧 Pendiente (módulos de negocio):
- Screens de autenticación (Login, ResetPassword, ActivateUser, etc.)
- Screens de usuario (Inicio, Depósitos, Transferencias, etc.)
- Screens de administración (Resumen, Productos, Usuarios, etc.)
