# 🎯 Sistema de Base de Datos Mock - Finaizen

## 📝 Descripción

Sistema completo de base de datos simulada (mock) para Finaizen, diseñado para funcionar sin backend mientras se desarrolla el frontend en React. Similar a un sistema de "Seed Data" en C# Entity Framework.

---

## ✅ ¿Qué se creó?

### 📊 8 Modelos de Datos (Clases JavaScript)

1. **User.js** - Usuario del sistema
2. **Perfil.js** - Perfil financiero (personal/empresa)
3. **Ingreso.js** - Ingresos recurrentes u ocasionales
4. **Egreso.js** - Egresos con clasificación IA
5. **RegistroHistorial.js** - Transacciones ejecutadas
6. **Presupuesto.js** - Límites de gasto por categoría
7. **Logro.js** - Sistema de logros/achievements
8. **Notificacion.js** - Notificaciones del sistema

### 🗄️ MockDatabase (Base de Datos Simulada)

Archivo: `src/utils/mockDatabase.js`

**Contiene:**
- ✅ 3 usuarios de prueba (admin, maria, carlos)
- ✅ 3 perfiles financieros
- ✅ 3 ingresos programados
- ✅ 6 egresos programados
- ✅ 6 registros en historial
- ✅ 4 presupuestos con estados diferentes
- ✅ 30 logros (10 por perfil)
- ✅ 3 notificaciones

---

## 🎮 Usuarios de Prueba

### Usuario Admin
```javascript
correo: 'admin@finaizen.com'
usuario: 'admin'
contraseña: 'admin123'
rol: admin
```

### Usuario Regular 1 (Con datos completos)
```javascript
correo: 'maria@example.com'
usuario: 'maria.gonzalez'
contraseña: 'maria123'
rol: user
perfiles: 2 ("Personal" y "Negocio")
```

### Usuario Regular 2 (Perfil vacío)
```javascript
correo: 'carlos@example.com'
usuario: 'carlos.ramirez'
contraseña: 'carlos123'
rol: user
perfiles: 1 ("Personal")
```

---

## 🚀 Uso Rápido

### 1. Login
```javascript
import mockDB from './utils/mockDatabase';

const result = mockDB.login('maria@example.com', 'maria123');

if (result.success) {
  console.log('Usuario:', result.user);
  console.log('Perfil:', result.perfil);
  // mockDB.currentUser y mockDB.currentPerfil están listos
}
```

### 2. Registro
```javascript
const nuevoUsuario = mockDB.register({
  nombre: 'Juan',
  apellido: 'Pérez',
  correo: 'juan@example.com',
  nombreUsuario: 'juan.perez',
  contraseña: 'juan123',
  pais: 'México',
  fechaNacimiento: '1990-01-15'
});

// Se crea automáticamente:
// - Usuario
// - Perfil inicial
// - 10 logros predefinidos
// Y queda autenticado
```

### 3. Obtener Datos del Dashboard
```javascript
const perfilId = mockDB.currentPerfil.id;

const ingresos = mockDB.getIngresosDePerf(perfilId);
const egresos = mockDB.getEgresosDePerf(perfilId);
const historial = mockDB.getHistorialDePerfil(perfilId, 11, 2024);
const presupuestos = mockDB.getPresupuestosDePerfil(perfilId);
const logros = mockDB.getLogrosDePerfil(perfilId);
const notificaciones = mockDB.getNotificacionesDeUsuario(mockDB.currentUser.id);
```

### 3. Crear Nuevo Ingreso
```javascript
import Ingreso from './models/Ingreso';

// Generar nuevo ID auto-incremental
const nuevoId = mockDB.ingresos.length > 0 
  ? Math.max(...mockDB.ingresos.map(i => i.id)) + 1 
  : 1;

const nuevoIngreso = new Ingreso({
  id: nuevoId,
  perfilId: mockDB.currentPerfil.id,
  monto: 1500,
  descripcion: 'Salario',
  categoria: 'Salario',
  frecuencia: 'mensual',
  diaMes: 5,
  horaNotificacion: '09:00',
  notificacionActiva: true
});

mockDB.ingresos.push(nuevoIngreso);
mockDB.currentPerfil.agregarIngreso(nuevoIngreso.id);
```

### 4. Crear Egreso con Clasificación IA
```javascript
import Egreso from './models/Egreso';

// Generar nuevo ID auto-incremental
const nuevoId = mockDB.egresos.length > 0 
  ? Math.max(...mockDB.egresos.map(e => e.id)) + 1 
  : 1;

const nuevoEgreso = new Egreso({
  id: nuevoId,
  perfilId: mockDB.currentPerfil.id,
  monto: 15.99,
  descripcion: 'Netflix',
  frecuencia: 'mensual',
  diaMes: 10
});

// Clasificación automática
nuevoEgreso.clasificarConIA();
console.log(nuevoEgreso.clasificacionIA); // "Suscripciones"

mockDB.egresos.push(nuevoEgreso);
mockDB.currentPerfil.agregarEgreso(nuevoEgreso.id);
```

---

## 🔄 Sistema de Ejecución Automática

### Scheduler (Simulación)

El sistema simula un scheduler que ejecuta transacciones pendientes:

```javascript
import RegistroHistorial from './models/RegistroHistorial';
import Notificacion from './models/Notificacion';

// En un useEffect con setInterval:
useEffect(() => {
  const scheduler = setInterval(() => {
    // Verificar ingresos pendientes
    mockDB.ingresos.forEach(ingreso => {
      if (ingreso.debeEjecutarse()) {
        // 1. Crear registro en historial
        const registro = RegistroHistorial.fromIngreso(ingreso, ingreso.perfilId);
        mockDB.historial.push(registro);

        // 2. Marcar como ejecutado y calcular próxima ejecución
        ingreso.marcarComoEjecutado();

        // 3. Crear notificación
        const notif = Notificacion.crearNotificacionTransaccion(
          mockDB.currentUser.id,
          ingreso.perfilId,
          ingreso,
          'ingreso'
        );
        mockDB.notificaciones.push(notif);
      }
    });

    // Verificar egresos pendientes
    mockDB.egresos.forEach(egreso => {
      if (egreso.debeEjecutarse()) {
        // 1. Crear registro en historial
        const registro = RegistroHistorial.fromEgreso(egreso, egreso.perfilId);
        mockDB.historial.push(registro);

        // 2. Actualizar presupuesto
        const presupuesto = mockDB.presupuestos.find(
          p => p.perfilId === egreso.perfilId && p.categoria === egreso.categoria
        );
        if (presupuesto) {
          presupuesto.agregarGasto(egreso.monto);
          
          // Crear notificación si excede límite
          if (presupuesto.estado === 'warning' || presupuesto.estado === 'danger') {
            const notifPres = Notificacion.crearNotificacionPresupuesto(
              mockDB.currentUser.id,
              egreso.perfilId,
              presupuesto
            );
            mockDB.notificaciones.push(notifPres);
          }
        }

        // 3. Marcar como ejecutado
        egreso.marcarComoEjecutado();

        // 4. Crear notificación
        const notif = Notificacion.crearNotificacionTransaccion(
          mockDB.currentUser.id,
          egreso.perfilId,
          egreso,
          'egreso'
        );
        mockDB.notificaciones.push(notif);
      }
    });
  }, 60000); // Cada minuto

  return () => clearInterval(scheduler);
}, []);
```

---

## 📈 Características Avanzadas

### 1. Clasificación Automática con IA (Simulada)
```javascript
const egreso = new Egreso({
  descripcion: 'Pago de Netflix',
  // ...
});

egreso.clasificarConIA();
console.log(egreso.clasificacionIA); // "Suscripciones"
```

**Categorías detectadas:**
- Suscripciones: netflix, spotify, amazon, hbo, etc.
- Comida: supermercado, restaurante, pizza, etc.
- Transporte: uber, taxi, gasolina, etc.
- Servicios: luz, agua, internet, etc.
- Salud: farmacia, doctor, medicina, etc.

### 2. Sistema de Presupuestos Auto-actualizables

```javascript
const presupuesto = mockDB.presupuestos[0];

console.log(presupuesto.categoria); // "Comida"
console.log(presupuesto.montoLimite); // 400
console.log(presupuesto.montoGastado); // 320
console.log(presupuesto.porcentajeGastado); // 80%
console.log(presupuesto.estado); // "warning"
console.log(presupuesto.mensajeAlerta); // "¡Cuidado! Estás llegando al límite."
console.log(presupuesto.montoRestante); // 80
```

### 3. Sistema de Logros

```javascript
const logros = mockDB.getLogrosDePerfil(perfilId);

logros.forEach(logro => {
  console.log(`${logro.icono} ${logro.nombre}`);
  console.log(`Progreso: ${logro.progreso}/${logro.meta}`);
  console.log(`Desbloqueado: ${logro.desbloqueado ? '✅' : '❌'}`);
});

// Actualizar progreso de un logro
const logroRacha = logros.find(l => l.id === 'logro_racha_7_dias');
logroRacha.actualizarProgreso(5); // 5 días de racha
console.log(`${logroRacha.progreso}/${logroRacha.meta}`); // 5/7

// Si llega a 7, se desbloquea automáticamente:
logroRacha.actualizarProgreso(7);
console.log(logroRacha.desbloqueado); // true
```

### 4. Frecuencias de Transacciones

```javascript
// Diario: Todos los días
{
  frecuencia: 'diario',
  diasSemana: [0,1,2,3,4,5,6] // Todos los días
}

// Semanal: Días específicos
{
  frecuencia: 'semanal',
  diasSemana: [1, 3, 5] // Lunes, Miércoles, Viernes
}

// Mensual: Día específico del mes
{
  frecuencia: 'mensual',
  diaMes: 15 // Día 15 de cada mes
}

// Anual: Fecha específica cada año
{
  frecuencia: 'anual',
  fechaEspecifica: '2024-12-25' // 25 de diciembre cada año
}

// Ocasional: Una sola vez
{
  frecuencia: 'ocasional',
  fechaEspecifica: '2024-11-20' // Solo una vez
}
```

---

## 🎨 Hooks Personalizados (React)

### useAuth Hook
```javascript
import { useState } from 'react';
import mockDB from '../utils/mockDatabase';

function useAuth() {
  const [currentUser, setCurrentUser] = useState(mockDB.currentUser);
  const [currentPerfil, setCurrentPerfil] = useState(mockDB.currentPerfil);

  const login = (correoOUsername, contraseña) => {
    const result = mockDB.login(correoOUsername, contraseña);
    if (result.success) {
      setCurrentUser(result.user);
      setCurrentPerfil(result.perfil);
    }
    return result;
  };

  const logout = () => {
    mockDB.logout();
    setCurrentUser(null);
    setCurrentPerfil(null);
  };

  const register = (userData) => {
    const result = mockDB.register(userData);
    if (result.success) {
      setCurrentUser(result.user);
      setCurrentPerfil(result.perfil);
    }
    return result;
  };

  return {
    currentUser,
    currentPerfil,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.esAdmin || false,
    login,
    logout,
    register
  };
}

// Uso en componente:
function App() {
  const { currentUser, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div>
      <h1>Bienvenido, {currentUser.nombreCompleto}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## 📚 Archivos Creados

```
src/
├── models/
│   ├── User.js                 # Modelo de Usuario
│   ├── Perfil.js               # Modelo de Perfil
│   ├── Ingreso.js              # Modelo de Ingreso
│   ├── Egreso.js               # Modelo de Egreso
│   ├── RegistroHistorial.js    # Modelo de Registro
│   ├── Presupuesto.js          # Modelo de Presupuesto
│   ├── Logro.js                # Modelo de Logro
│   ├── Notificacion.js         # Modelo de Notificación
│   └── index.js                # Barrel export
│
└── utils/
    ├── mockDatabase.js         # Base de datos mock con seed data
    └── ejemplosUso.js          # Ejemplos de uso y hooks
```

---

## 🎓 Conceptos Implementados

✅ **Programación Orientada a Objetos (POO)**
- Clases con propiedades y métodos
- Getters computados
- Métodos estáticos
- Serialización/Deserialización (toJSON/fromJSON)

✅ **Relaciones entre Entidades**
- User 1:N Perfil
- Perfil 1:N Ingreso/Egreso/Presupuesto/Logro
- Composición: Ingreso/Egreso → RegistroHistorial

✅ **Lógica de Negocio**
- Cálculo de próxima ejecución según frecuencia
- Clasificación automática con IA (simulada)
- Auto-actualización de presupuestos
- Sistema de logros con progreso

✅ **Patrón Singleton**
- MockDatabase es una instancia única compartida

---

## 🚀 Próximos Pasos

1. **Crear Context API para Auth**
   ```javascript
   // src/context/AuthContext.jsx
   const AuthContext = createContext();
   ```

2. **Implementar Scheduler en App.jsx**
   ```javascript
   useEffect(() => {
     const interval = setInterval(ejecutarTransacciones, 60000);
     return () => clearInterval(interval);
   }, []);
   ```

3. **Crear páginas del Dashboard**
   - Dashboard User con gráficos
   - Gestión de Ingresos/Egresos
   - Vista de Presupuestos
   - Historial de Transacciones
   - Logros

4. **Añadir persistencia (opcional)**
   ```javascript
   // Guardar en localStorage al hacer cambios
   localStorage.setItem('finaizen_db', JSON.stringify(mockDB));
   ```

---

## 💡 Ventajas de este Sistema

✅ **Desarrollo sin Backend**: Frontend funciona completamente sin API  
✅ **Datos Realistas**: 3 usuarios con datos variados para testing  
✅ **Lógica Completa**: Scheduler, IA, logros, notificaciones  
✅ **Fácil Transición**: Cuando tengas backend, solo cambias mockDB por API calls  
✅ **Testing Simplificado**: Datos predecibles para pruebas  
✅ **Aprendizaje**: Entiende cómo funcionará el sistema real  

---

## ❓ Preguntas Frecuentes

**Q: ¿Los datos se pierden al recargar la página?**  
A: Sí, porque está en memoria. Puedes agregar localStorage para persistencia.

**Q: ¿Cómo ejecuto el scheduler?**  
A: Implementa un `useEffect` con `setInterval` en tu componente principal.

**Q: ¿Puedo agregar más usuarios?**  
A: Sí, usa `mockDB.register()` o edita directamente `mockDatabase.js`.

**Q: ¿La contraseña está segura?**  
A: No, está en texto plano. En producción usarías hashing (bcrypt).

**Q: ¿Cómo cambio entre perfiles?**  
A: `mockDB.currentPerfil = mockDB.perfiles.find(p => p.id === perfilId)`

---

**¡Sistema completo y listo para usar! 🎉**

Para más detalles, revisa:
- `DIAGRAMA_CLASES.md` - Diagramas UML y arquitectura
- `ejemplosUso.js` - 10 ejemplos prácticos
