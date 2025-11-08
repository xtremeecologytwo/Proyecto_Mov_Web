# Sistema de Protección de Rutas - Finaizen

## 📋 Descripción General

Este sistema implementa un mecanismo **estandarizado y normalizado** de autenticación y protección de rutas para asegurar que:

- ✅ Solo usuarios autenticados puedan acceder a las páginas Admin y User
- ✅ No se puede acceder directamente a las URLs sin pasar por login
- ✅ Las sesiones se gestionan de forma centralizada
- ✅ Los roles se validan automáticamente
- ✅ Las sesiones expiran por inactividad

## 🗂️ Estructura de Archivos

```
src/
├── js/
│   ├── auth/
│   │   ├── sessionManager.js    ← Gestor centralizado de sesiones
│   │   └── authGuard.js          ← Guardias de protección de rutas
│   ├── inicio_sesion.js          ← Login actualizado
│   └── ... (otros archivos)
└── pages/
    ├── Base/
    │   ├── index.html
    │   ├── login.html
    │   └── register.html
    ├── Admin/
    │   └── *.html               ← Protegidas automáticamente
    └── User/
        └── *.html               ← Protegidas automáticamente
```

## 🔐 Cómo Funciona

### 1. **sessionManager.js** - Gestor de Sesiones

Maneja todo lo relacionado con sesiones:

- Crear sesiones (`createSession()`)
- Validar autenticación (`isAuthenticated()`)
- Obtener datos del usuario (`getCurrentUser()`)
- Validar roles (`hasRole()`)
- Cerrar sesión (`logout()`)
- Recordar usuario (`rememberUser()`)

**Ejemplo de uso:**
```javascript
// Verificar si está autenticado
if (SessionManager.isAuthenticated()) {
    const user = SessionManager.getCurrentUser();
    console.log(user);
}

// Verificar rol
if (SessionManager.hasRole('admin')) {
    // hacer algo
}

// Cerrar sesión
SessionManager.logout();
```

### 2. **authGuard.js** - Guardias de Protección

Proporciona guardias reutilizables para proteger páginas:

- `requireAuth()` - Require autenticación general
- `requireRole(roles)` - Require un rol específico
- `requireAdmin()` - Require rol admin
- `requireUser()` - Require rol user
- `protectPage(roles)` - Protege toda la página
- `canAccessElement(roles)` - Valida acceso a un elemento

**Ejemplo de uso:**
```javascript
// Al inicio de un script en una página protegida
AuthGuard.protectPage('admin'); // Solo admins

// O validar antes de una acción
if (AuthGuard.requireAdmin()) {
    // hacer operación de admin
}

// Proteger elementos específicos
if (!AuthGuard.canAccessElement('user')) {
    element.style.display = 'none';
}
```

## 📝 Instrucciones de Implementación

### Paso 1: Incluir Scripts en HTML Protegidos

Todos los archivos HTML en carpetas **Admin/** y **User/** deben incluir estos scripts **antes de sus scripts personalizados**:

```html
<!-- Al final del archivo, antes del </body> -->
<script src="../../js/auth/sessionManager.js"></script>
<script src="../../js/auth/authGuard.js"></script>
<script src="../../js/dashboardAdmin.js"></script>  <!-- u otro script específico -->
<script src="../../js/main.js"></script>
```

### Paso 2: Proteger Páginas (Opcional)

Puedes agregar validación explícita en el script de la página:

```javascript
// En tu archivo .js específico (ej: dashboardAdmin.js)
document.addEventListener('DOMContentLoaded', () => {
    // Para Admin: requerir rol de admin
    if (!AuthGuard.requireAdmin()) {
        return; // Detener ejecución si no tiene acceso
    }

    // Para User: requerir rol de user
    if (!AuthGuard.requireUser()) {
        return;
    }

    // El resto del código de la página...
});
```

### Paso 3: Implementar Logout

Agregua un botón de logout que llame a:

```javascript
// En tu HTML
<button onclick="handleLogout()">Cerrar Sesión</button>

// En tu JS
function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        SessionManager.logout();
        window.location.href = '../../pages/Base/index.html';
    }
}
```

## 🎯 Flujo de Seguridad

```
1. Usuario ingresa URL (ej: /Admin/dashboard.html)
   ↓
2. Se carga sessionManager.js automáticamente
   ↓
3. El script detecta que es una ruta protegida
   ↓
4. Verifica si hay sesión activa
   ↓
5. ├─ SI: Permite acceso y ejecuta la página
   └─ NO: Redirige a login con mensaje
   ↓
6. Monitorea inactividad por 30 minutos
   ↓
7. Si hay inactividad: Cierra sesión y redirige
```

## 🔄 Estados de Sesión

| Estado | Descripción |
|--------|-------------|
| **Creada** | Usuario acaba de iniciar sesión |
| **Activa** | Usuario está usando la aplicación |
| **Monitorizada** | Se sigue la inactividad (30 min) |
| **Expirada** | Pasaron 30 min sin actividad |
| **Cerrada** | Usuario hizo logout |

## 🛡️ Protecciones Implementadas

- ✅ Validación de sesión al cargar páginas protegidas
- ✅ Monitoreo de inactividad (30 minutos)
- ✅ Redirección automática a login si expira
- ✅ Validación de roles
- ✅ Almacenamiento seguro en sessionStorage
- ✅ Opción "Recordarme" en localStorage
- ✅ Prevención de acceso directo a URLs

## 📦 Usuarios de Prueba

```
Usuario Normal:
  Email: usuario@finaizen.com
  Contraseña: usuario123

Administrador:
  Email: admin@finaizen.com
  Contraseña: admin123
```

## 📊 Configuración Personalizable

En `sessionManager.js` puedes modificar:

```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000; // Cambiar tiempo de expiración
const SESSION_STORAGE_KEY = 'finaizen_session'; // Cambiar nombre de clave
```

## 🔍 Debug y Monitoreo

Para ver información de debug en la consola:

```javascript
// Ver sesión actual
console.log(SessionManager.getSession());

// Ver usuario actual
console.log(SessionManager.getCurrentUser());

// Ver información del usuario
console.log(AuthGuard.getUserInfo());

// Ver si está autenticado
console.log(SessionManager.isAuthenticated());
```

## ❌ Solución de Problemas

### Problema: Los usuarios pueden acceder a Admin sin login
**Solución:** Verifica que todos los HTML de Admin tengan los scripts de auth

### Problema: Las sesiones expiran muy rápido
**Solución:** Aumenta `SESSION_TIMEOUT` en sessionManager.js

### Problema: El usuario no puede hacer logout
**Solución:** Implementa el botón de logout llamando a `SessionManager.logout()`

## 📚 Ejemplos Completos

### Proteger una página de Admin:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Panel Admin</title>
</head>
<body>
    <!-- Contenido -->
    
    <script src="../../js/auth/sessionManager.js"></script>
    <script src="../../js/auth/authGuard.js"></script>
    <script src="../../js/dashboardAdmin.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Proteger esta página para solo admins
            AuthGuard.requireAdmin();
        });
    </script>
</body>
</html>
```

### Proteger un User:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard Usuario</title>
</head>
<body>
    <!-- Contenido -->
    
    <script src="../../js/auth/sessionManager.js"></script>
    <script src="../../js/auth/authGuard.js"></script>
    <script src="../../js/dashboardUser.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Proteger esta página para usuarios autenticados
            AuthGuard.requireUser();
        });
    </script>
</body>
</html>
```

## 🎓 Conclusión

Este sistema proporciona:

- ✅ Protección centralizada de rutas
- ✅ Gestión normalizada de sesiones
- ✅ Validación automática de roles
- ✅ Experiencia segura para usuarios
- ✅ Fácil de mantener y extender

Para cualquier duda, revisa los comentarios en los archivos de autenticación.
