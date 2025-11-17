# Sistema de Logs de Seguridad - Finaizen

## 📋 Descripción General

Sistema de registro y auditoría de eventos de seguridad que rastrea todas las acciones críticas realizadas por usuarios en la plataforma Finaizen.

## 🎯 Objetivos

1. **Auditoría completa** de acciones de usuarios
2. **Detección de actividad sospechosa** (intentos fallidos, múltiples accesos)
3. **Trazabilidad** de cambios en configuración de cuenta
4. **Cumplimiento** de normativas de seguridad
5. **Monitoreo en tiempo real** por administradores

---

## 📊 Modelo de Datos

### Clase: SecurityLog

```javascript
class SecurityLog {
  constructor({
    id,                    // String: ID único generado automáticamente
    timestamp,             // String: ISO 8601 timestamp
    userId,                // String: ID del usuario afectado
    userEmail,             // String: Email del usuario
    eventType,             // String: Tipo de evento (ver tipos abajo)
    eventCategory,         // String: Categoría (autenticacion, configuracion, datos)
    description,           // String: Descripción legible del evento
    ipAddress,             // String: Dirección IP de origen
    userAgent,             // String: Navegador/dispositivo usado
    status,                // String: 'success' | 'failure' | 'warning'
    severity,              // String: 'low' | 'medium' | 'high' | 'critical'
    metadata               // Object: Datos adicionales específicos del evento
  }) {
    this.id = id || generateId();
    this.timestamp = timestamp || new Date().toISOString();
    this.userId = userId;
    this.userEmail = userEmail;
    this.eventType = eventType;
    this.eventCategory = eventCategory;
    this.description = description;
    this.ipAddress = ipAddress || 'Unknown';
    this.userAgent = userAgent || 'Unknown';
    this.status = status;
    this.severity = severity;
    this.metadata = metadata || {};
  }
}
```

---

## 🔐 Tipos de Eventos

### 1. Categoría: AUTENTICACION

| Event Type | Descripción | Severity |
|-----------|-------------|----------|
| `LOGIN_SUCCESS` | Inicio de sesión exitoso | low |
| `LOGIN_FAILURE` | Intento de inicio de sesión fallido | medium |
| `LOGIN_BLOCKED` | Intento de acceso bloqueado (cuenta bloqueada) | high |
| `LOGOUT` | Cierre de sesión | low |
| `SESSION_EXPIRED` | Sesión expirada | low |
| `PASSWORD_RESET_REQUEST` | Solicitud de reseteo de contraseña | medium |
| `PASSWORD_RESET_SUCCESS` | Contraseña reseteada exitosamente | high |
| `PASSWORD_RESET_FAILURE` | Intento fallido de reseteo | medium |
| `TWO_FACTOR_ENABLED` | Autenticación 2FA activada | high |
| `TWO_FACTOR_DISABLED` | Autenticación 2FA desactivada | high |
| `TWO_FACTOR_VERIFIED` | Código 2FA verificado | low |
| `TWO_FACTOR_FAILED` | Fallo en verificación 2FA | medium |

### 2. Categoría: CONFIGURACION

| Event Type | Descripción | Severity |
|-----------|-------------|----------|
| `EMAIL_CHANGE_REQUEST` | Solicitud de cambio de email | high |
| `EMAIL_CHANGED` | Email cambiado exitosamente | critical |
| `PASSWORD_CHANGED` | Contraseña cambiada | critical |
| `PROFILE_UPDATED` | Perfil de usuario actualizado | low |
| `PERFIL_CREATED` | Nuevo perfil financiero creado | medium |
| `PERFIL_DELETED` | Perfil financiero eliminado | high |
| `PERFIL_SWITCHED` | Cambio entre perfiles | low |
| `NOTIFICATION_SETTINGS_CHANGED` | Configuración de notificaciones modificada | low |
| `PRIVACY_SETTINGS_CHANGED` | Configuración de privacidad modificada | medium |

### 3. Categoría: DATOS

| Event Type | Descripción | Severity |
|-----------|-------------|----------|
| `DATA_EXPORT_REQUEST` | Solicitud de exportación de datos | high |
| `DATA_EXPORT_COMPLETED` | Exportación completada | high |
| `DATA_IMPORT` | Importación de datos | medium |
| `DATA_DELETED` | Datos eliminados por usuario | high |
| `BACKUP_CREATED` | Backup de datos creado | low |

### 4. Categoría: ACCESO

| Event Type | Descripción | Severity |
|-----------|-------------|----------|
| `ACCOUNT_CREATED` | Nueva cuenta creada | medium |
| `ACCOUNT_DELETED` | Cuenta eliminada | critical |
| `ACCOUNT_SUSPENDED` | Cuenta suspendida | critical |
| `ACCOUNT_REACTIVATED` | Cuenta reactivada | high |
| `PERMISSION_CHANGED` | Permisos de usuario modificados | high |

### 5. Categoría: SOSPECHOSO

| Event Type | Descripción | Severity |
|-----------|-------------|----------|
| `MULTIPLE_LOGIN_FAILURES` | Múltiples intentos fallidos consecutivos | critical |
| `SUSPICIOUS_IP` | Acceso desde IP sospechosa | high |
| `UNUSUAL_ACTIVITY` | Actividad inusual detectada | high |
| `BRUTE_FORCE_ATTEMPT` | Posible ataque de fuerza bruta | critical |

---

## 💾 Estructura en mockDB

```javascript
// En mockDatabase.js
const mockDB = {
  // ... otros datos existentes
  
  securityLogs: [], // Array de SecurityLog
  
  // Configuración de seguridad
  securityConfig: {
    maxLoginAttempts: 5,           // Máximo de intentos antes de bloqueo
    loginAttemptWindow: 15 * 60,   // Ventana de tiempo (15 min en segundos)
    sessionTimeout: 30 * 60,       // Timeout de sesión (30 min)
    requireStrongPassword: true,
    require2FA: false,
    ipWhitelist: [],
    ipBlacklist: []
  },
  
  // Rastreo de intentos de login por usuario
  loginAttempts: {
    // 'user@email.com': {
    //   count: 3,
    //   firstAttempt: timestamp,
    //   lastAttempt: timestamp,
    //   ips: ['192.168.1.1']
    // }
  }
};
```

---

## 🛠️ Métodos de mockDB

### Crear Log
```javascript
createSecurityLog(logData) {
  const log = new SecurityLog(logData);
  this.securityLogs.push(log);
  this.saveToLocalStorage();
  
  // Si es evento crítico, puede disparar alertas
  if (log.severity === 'critical') {
    this.handleCriticalEvent(log);
  }
  
  return log;
}
```

### Obtener Logs
```javascript
// Obtener todos los logs
getAllSecurityLogs() {
  return [...this.securityLogs].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
}

// Filtrar logs por criterios
getSecurityLogs(filters = {}) {
  let logs = [...this.securityLogs];
  
  if (filters.userId) {
    logs = logs.filter(log => log.userId === filters.userId);
  }
  
  if (filters.eventType) {
    logs = logs.filter(log => log.eventType === filters.eventType);
  }
  
  if (filters.eventCategory) {
    logs = logs.filter(log => log.eventCategory === filters.eventCategory);
  }
  
  if (filters.status) {
    logs = logs.filter(log => log.status === filters.status);
  }
  
  if (filters.severity) {
    logs = logs.filter(log => log.severity === filters.severity);
  }
  
  if (filters.startDate) {
    logs = logs.filter(log => 
      new Date(log.timestamp) >= new Date(filters.startDate)
    );
  }
  
  if (filters.endDate) {
    logs = logs.filter(log => 
      new Date(log.timestamp) <= new Date(filters.endDate)
    );
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    logs = logs.filter(log => 
      log.userEmail.toLowerCase().includes(term) ||
      log.description.toLowerCase().includes(term) ||
      log.ipAddress.includes(term)
    );
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Obtener estadísticas de seguridad
getSecurityStats(hours = 24) {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recentLogs = this.securityLogs.filter(log => 
    new Date(log.timestamp) >= cutoffTime
  );
  
  return {
    totalEvents: recentLogs.length,
    failedLogins: recentLogs.filter(log => 
      log.eventType === 'LOGIN_FAILURE'
    ).length,
    criticalEvents: recentLogs.filter(log => 
      log.severity === 'critical'
    ).length,
    blockedAccounts: new Set(
      recentLogs
        .filter(log => log.eventType === 'ACCOUNT_SUSPENDED')
        .map(log => log.userId)
    ).size,
    uniqueIPs: new Set(recentLogs.map(log => log.ipAddress)).size,
    byCategory: this.groupByCategory(recentLogs),
    bySeverity: this.groupBySeverity(recentLogs)
  };
}
```

### Rastreo de Intentos de Login
```javascript
trackLoginAttempt(email, success, ipAddress) {
  if (!this.loginAttempts[email]) {
    this.loginAttempts[email] = {
      count: 0,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
      ips: []
    };
  }
  
  const attempt = this.loginAttempts[email];
  const now = Date.now();
  
  // Resetear si pasó la ventana de tiempo
  if (now - attempt.firstAttempt > this.securityConfig.loginAttemptWindow * 1000) {
    attempt.count = 0;
    attempt.firstAttempt = now;
    attempt.ips = [];
  }
  
  if (!success) {
    attempt.count++;
    attempt.lastAttempt = now;
    if (!attempt.ips.includes(ipAddress)) {
      attempt.ips.push(ipAddress);
    }
    
    // Crear log de intento fallido
    this.createSecurityLog({
      userId: null,
      userEmail: email,
      eventType: 'LOGIN_FAILURE',
      eventCategory: 'autenticacion',
      description: `Intento de inicio de sesión fallido`,
      ipAddress: ipAddress,
      status: 'failure',
      severity: attempt.count >= 3 ? 'high' : 'medium',
      metadata: {
        attemptNumber: attempt.count,
        totalAttempts: attempt.count
      }
    });
    
    // Bloquear si excede intentos
    if (attempt.count >= this.securityConfig.maxLoginAttempts) {
      this.createSecurityLog({
        userId: null,
        userEmail: email,
        eventType: 'MULTIPLE_LOGIN_FAILURES',
        eventCategory: 'sospechoso',
        description: `Cuenta bloqueada por múltiples intentos fallidos (${attempt.count})`,
        ipAddress: ipAddress,
        status: 'failure',
        severity: 'critical',
        metadata: {
          totalAttempts: attempt.count,
          timeWindow: this.securityConfig.loginAttemptWindow,
          ips: attempt.ips
        }
      });
      
      return { blocked: true, attempts: attempt.count };
    }
  } else {
    // Login exitoso - resetear contador
    this.createSecurityLog({
      userId: this.getCurrentUserId(email),
      userEmail: email,
      eventType: 'LOGIN_SUCCESS',
      eventCategory: 'autenticacion',
      description: 'Inicio de sesión exitoso',
      ipAddress: ipAddress,
      status: 'success',
      severity: 'low'
    });
    
    delete this.loginAttempts[email];
  }
  
  return { blocked: false, attempts: attempt.count };
}
```

---

## 📱 Componentes React

### Páginas a Crear

1. **RegistroSeguridad.jsx** (Admin)
   - Vista de tabla de logs con filtros
   - KPIs de seguridad
   - Acciones de bloqueo/desbloqueo

2. **ConfigSeguridad.jsx** (User)
   - Cambiar contraseña
   - Activar/desactivar 2FA
   - Ver actividad reciente de la cuenta
   - Sesiones activas

3. **ConfigCuenta.jsx** (User)
   - Cambiar email
   - Actualizar información personal
   - Eliminar cuenta

---

## 🔄 Integración con Sistema Existente

### En AuthContext
```javascript
// Modificar función login
const login = async (email, password) => {
  const ipAddress = await getClientIP(); // Simulado
  
  const result = mockDB.login(email, password);
  
  if (result.success) {
    mockDB.trackLoginAttempt(email, true, ipAddress);
    setCurrentUser(result.user);
    // ...
  } else {
    mockDB.trackLoginAttempt(email, false, ipAddress);
    // Verificar si cuenta está bloqueada
    // ...
  }
};

// Modificar función logout
const logout = () => {
  mockDB.createSecurityLog({
    userId: currentUser.id,
    userEmail: currentUser.email,
    eventType: 'LOGOUT',
    eventCategory: 'autenticacion',
    description: 'Cierre de sesión',
    status: 'success',
    severity: 'low'
  });
  
  setCurrentUser(null);
  setCurrentPerfil(null);
};
```

---

## 📊 KPIs de Seguridad

### Métricas en Dashboard Admin

1. **Intentos Fallidos (24h)**: Conteo de LOGIN_FAILURE
2. **Cuentas Bloqueadas**: Usuarios con ACCOUNT_SUSPENDED activo
3. **Eventos Críticos (24h)**: Logs con severity='critical'
4. **IPs Únicas (24h)**: Número de direcciones IP distintas
5. **Tasa de Éxito de Login**: % de LOGIN_SUCCESS vs LOGIN_FAILURE

### Gráficas Sugeridas

- **Línea temporal** de eventos por hora
- **Distribución** por tipo de evento (pie chart)
- **Top 10 IPs** con más actividad
- **Mapa de calor** de intentos por hora del día

---

## 🎨 UI/UX Consideraciones

### Códigos de Color por Severity

- **Low** (verde): `#10b981`
- **Medium** (amarillo): `#f59e0b`
- **High** (naranja): `#f97316`
- **Critical** (rojo): `#ef4444`

### Iconos por Categoría

- 🔐 Autenticación
- ⚙️ Configuración
- 📊 Datos
- 🚪 Acceso
- ⚠️ Sospechoso

---

## 📝 Datos de Prueba

```javascript
// Generar logs de ejemplo
const sampleLogs = [
  {
    userEmail: 'juan.perez@email.com',
    eventType: 'LOGIN_SUCCESS',
    eventCategory: 'autenticacion',
    description: 'Inicio de sesión exitoso',
    ipAddress: '192.168.1.105',
    status: 'success',
    severity: 'low'
  },
  {
    userEmail: 'ana.garcia@email.com',
    eventType: 'LOGIN_FAILURE',
    eventCategory: 'autenticacion',
    description: 'Intento de inicio de sesión fallido - contraseña incorrecta',
    ipAddress: '192.168.1.107',
    status: 'failure',
    severity: 'medium'
  },
  {
    userEmail: 'carlos.ruiz@email.com',
    eventType: 'PASSWORD_CHANGED',
    eventCategory: 'configuracion',
    description: 'Contraseña cambiada exitosamente',
    ipAddress: '192.168.1.110',
    status: 'success',
    severity: 'critical'
  },
  // ... más logs
];
```

---

## 🚀 Plan de Implementación

### Fase 1: Modelo y Base de Datos ✅
1. Crear clase SecurityLog
2. Agregar métodos a mockDB
3. Generar datos de prueba

### Fase 2: Páginas de Configuración
1. ConfigSeguridad.jsx
2. ConfigCuenta.jsx
3. ConfigPerfiles.jsx
4. ConfigNotificaciones.jsx
5. ConfigAyuda.jsx

### Fase 3: Panel Admin
1. RegistroSeguridad.jsx (Admin)
2. Componentes de estadísticas
3. Filtros y búsqueda avanzada

### Fase 4: Integración
1. Modificar AuthContext
2. Agregar logs en todas las acciones críticas
3. Testing completo

---

## ✅ Checklist de Eventos a Registrar

**Autenticación:**
- [x] Login exitoso
- [x] Login fallido
- [x] Logout
- [ ] Recuperación de contraseña
- [ ] 2FA activado/desactivado

**Configuración:**
- [ ] Cambio de email
- [ ] Cambio de contraseña
- [ ] Actualización de perfil
- [ ] Creación de perfil financiero
- [ ] Eliminación de perfil financiero

**Datos:**
- [ ] Exportación de datos
- [ ] Eliminación de datos
- [ ] Importación de transacciones

**Acceso:**
- [x] Registro de cuenta
- [ ] Eliminación de cuenta
- [ ] Cambio de permisos (admin)

---

**Fecha de Creación:** Noviembre 11, 2025  
**Estado:** 📋 Planificación Completa  
**Próximo Paso:** Implementar modelo SecurityLog en mockDB
