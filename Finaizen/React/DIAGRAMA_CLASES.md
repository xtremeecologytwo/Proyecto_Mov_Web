# 📊 Diagrama de Clases y Arquitectura - Finaizen

## 🎯 Visión General del Sistema

Finaizen es un sistema de gestión financiera personal/empresarial que permite a los usuarios:
- Registrar ingresos y egresos recurrentes u ocasionales
- Crear presupuestos por categoría
- Visualizar historial de transacciones
- Desbloquear logros según su actividad
- Recibir notificaciones sobre transacciones y alertas

---

## 📐 Diagrama de Clases (UML)

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                                                     │
│ - nombre: string                                                 │
│ - apellido: string                                               │
│ - correo: string (unique)                                        │
│ - nombreUsuario: string (unique)                                 │
│ - contraseña: string (hasheado en producción)                    │
│ - pais: string                                                   │
│ - fechaNacimiento: Date                                          │
│ - rol: 'user' | 'admin'                                          │
│ - perfiles: string[] (IDs de perfiles)                           │
│ - notificaciones: Notificacion[]                                 │
│ - createdAt: Date                                                │
│ - updatedAt: Date                                                │
├─────────────────────────────────────────────────────────────────┤
│ + get edad(): number                                             │
│ + get nombreCompleto(): string                                   │
│ + get esAdmin(): boolean                                         │
│ + verificarContraseña(contraseña: string): boolean               │
│ + agregarPerfil(perfilId: string): void                          │
│ + eliminarPerfil(perfilId: string): void                         │
│ + toJSON(): Object                                               │
│ + static fromJSON(json: Object): User                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ 1
                            │
                            │ tiene 1..* (uno o muchos)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          PERFIL                                  │
├─────────────────────────────────────────────────────────────────┤
│ - id: string                                                     │
│ - userId: string (FK → User.id)                                  │
│ - nombre: string (ej: "Personal", "Negocio")                     │
│ - moneda: string (USD, MXN, COP, etc.)                           │
│ - simboloMoneda: string ($, €, etc.)                             │
│ - createdAt: Date                                                │
│ - ingresos: string[] (IDs de ingresos)                           │
│ - egresos: string[] (IDs de egresos)                             │
│ - presupuestos: string[] (IDs de presupuestos)                   │
│ - logros: string[] (IDs de logros)                               │
│ - configuracion: Object                                          │
├─────────────────────────────────────────────────────────────────┤
│ + get saldoTotal(): number                                       │
│ + get ahorroMensual(): number                                    │
│ + agregarIngreso(ingresoId: string): void                        │
│ + agregarEgreso(egresoId: string): void                          │
│ + agregarPresupuesto(presupuestoId: string): void                │
│ + agregarLogro(logroId: string): void                            │
│ + toJSON(): Object                                               │
│ + static fromJSON(json: Object): Perfil                          │
└─────────────────────────────────────────────────────────────────┘
          │
          ├─────────────────┬──────────────────┬─────────────┬──────────┐
          │                 │                  │             │          │
          │ tiene *         │ tiene *          │ tiene *     │ tiene *  │
          ▼                 ▼                  ▼             ▼          ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐ ┌──────┐ ┌──────────────┐
│    INGRESO       │ │     EGRESO       │ │ PRESUPUESTO │ │ LOGRO│ │ REG.HISTORIAL│
└──────────────────┘ └──────────────────┘ └─────────────┘ └──────┘ └──────────────┘
```

---

## 🏗️ Relaciones Entre Clases

### 1. User ↔ Perfil (1 a muchos)
```
User (1) ──────── tiene ──────── (*) Perfil
```
- **Cardinalidad**: Un usuario puede tener 1 o muchos perfiles
- **Ejemplo**: María tiene "Personal" y "Negocio"
- **Relación**: `User.perfiles[]` contiene IDs de perfiles
- **Inversa**: `Perfil.userId` referencia al usuario dueño

### 2. Perfil ↔ Ingreso (1 a muchos)
```
Perfil (1) ──────── tiene ──────── (*) Ingreso
```
- **Cardinalidad**: Un perfil puede tener 0 o muchos ingresos
- **Ejemplo**: Perfil "Personal" tiene "Salario", "Freelance", "Inversión"
- **Relación**: `Perfil.ingresos[]` contiene IDs de ingresos
- **Inversa**: `Ingreso.perfilId` referencia al perfil

### 3. Perfil ↔ Egreso (1 a muchos)
```
Perfil (1) ──────── tiene ──────── (*) Egreso
```
- Similar a Ingreso

### 4. Perfil ↔ Presupuesto (1 a muchos)
```
Perfil (1) ──────── tiene ──────── (*) Presupuesto
```
- **Función**: Define límites de gasto por categoría
- **Auto-actualización**: Cada egreso incrementa el `montoGastado` del presupuesto correspondiente

### 5. Perfil ↔ RegistroHistorial (1 a muchos)
```
Perfil (1) ──────── genera ──────── (*) RegistroHistorial
```
- **Función**: Almacena transacciones ya ejecutadas
- **Generación**: Se crea automáticamente cuando un Ingreso/Egreso se ejecuta

### 6. Ingreso/Egreso → RegistroHistorial (Composición)
```
Ingreso/Egreso ──────── crea ──────── RegistroHistorial
```
- Cuando llega la fecha/hora de un ingreso/egreso, se genera un registro en historial

---

## 📊 Modelo de Datos Detallado

### 🧑 User (Usuario)
```javascript
{
  id: 'user_001',
  nombre: 'María',
  apellido: 'González',
  correo: 'maria@example.com',
  nombreUsuario: 'maria.gonzalez',
  contraseña: 'hash_de_contraseña',
  pais: 'Ecuador',
  fechaNacimiento: '1998-03-20',
  rol: 'user', // 'user' o 'admin'
  perfiles: ['perfil_001', 'perfil_002'],
  createdAt: '2024-02-15T00:00:00Z',
  updatedAt: '2024-11-09T00:00:00Z'
}
```

**Propiedades Computadas:**
- `edad`: Calculada a partir de `fechaNacimiento`
- `nombreCompleto`: `${nombre} ${apellido}`
- `esAdmin`: `rol === 'admin'`

---

### 📁 Perfil (Profile)
```javascript
{
  id: 'perfil_001',
  userId: 'user_001',
  nombre: 'Personal',
  moneda: 'USD',
  simboloMoneda: '$',
  createdAt: '2024-02-15T00:00:00Z',
  ingresos: ['ing_001', 'ing_002'],
  egresos: ['egr_001', 'egr_002', 'egr_003'],
  presupuestos: ['pres_001', 'pres_002'],
  logros: ['logro_001', 'logro_002'],
  configuracion: {}
}
```

**Función:**
- Permite separar finanzas personales de empresariales
- Cada perfil tiene su propia moneda
- Usuario puede cambiar entre perfiles

---

### 💰 Ingreso (Income)
```javascript
{
  id: 'ing_001',
  perfilId: 'perfil_001',
  monto: 1500,
  descripcion: 'Salario Mensual',
  categoria: 'Salario',
  frecuencia: 'mensual', // 'diario' | 'semanal' | 'mensual' | 'anual' | 'ocasional'
  
  // Configuración según frecuencia:
  diasSemana: [], // Para 'semanal': [0,1,2,3,4,5,6]
  diaMes: 5, // Para 'mensual': 1-31
  fechaEspecifica: null, // Para 'anual' u 'ocasional'
  
  // Notificaciones:
  horaNotificacion: '09:00',
  notificacionActiva: true,
  
  // Control:
  activo: true,
  proximaEjecucion: '2024-12-05T09:00:00Z',
  
  createdAt: '2024-02-15T00:00:00Z',
  updatedAt: '2024-11-09T00:00:00Z'
}
```

**Lógica de Ejecución:**
1. Sistema verifica cada hora si `proximaEjecucion <= ahora`
2. Si es true, crea un `RegistroHistorial`
3. Marca el ingreso como ejecutado
4. Calcula y actualiza `proximaEjecucion` para la siguiente vez
5. Si es 'ocasional', desactiva el ingreso (`activo = false`)

---

### 💸 Egreso (Expense)
```javascript
{
  id: 'egr_002',
  perfilId: 'perfil_001',
  monto: 15.99,
  descripcion: 'Netflix',
  categoria: 'Suscripciones', // Manual
  clasificacionIA: 'Suscripciones', // Automática por IA
  frecuencia: 'mensual',
  diaMes: 10,
  horaNotificacion: null,
  notificacionActiva: false,
  activo: true,
  proximaEjecucion: '2024-12-10T00:00:00Z',
  createdAt: '2024-02-15T00:00:00Z',
  updatedAt: '2024-11-09T00:00:00Z'
}
```

**Clasificación con IA (Simulada):**
- Analiza `descripcion` con palabras clave
- Si contiene "netflix", "spotify" → `Suscripciones`
- Si contiene "supermercado", "comida" → `Comida`
- Si contiene "uber", "gasolina" → `Transporte`

**Al Ejecutarse:**
1. Crea `RegistroHistorial`
2. Busca presupuesto de la misma categoría
3. Incrementa `Presupuesto.montoGastado`
4. Si excede el límite, genera `Notificacion`

---

### 📝 RegistroHistorial (Transaction Record)
```javascript
{
  id: 'hist_005',
  perfilId: 'perfil_001',
  tipo: 'ingreso', // 'ingreso' | 'egreso'
  monto: 1500,
  descripcion: 'Salario Mensual',
  categoria: 'Salario',
  transaccionOrigenId: 'ing_001', // ID del ingreso/egreso que lo generó
  fechaEjecucion: '2024-11-05T09:00:00Z',
  mes: 11,
  anio: 2024
}
```

**Función:**
- Almacena transacciones ya ejecutadas (historial inmutable)
- Permite filtrar por mes/año
- Se usa para calcular estadísticas y gráficos

---

### 📊 Presupuesto (Budget)
```javascript
{
  id: 'pres_003',
  perfilId: 'perfil_001',
  categoria: 'Suscripciones',
  montoLimite: 50,
  montoGastado: 55, // Se actualiza automáticamente
  periodo: 'mensual', // 'semanal' | 'mensual' | 'anual'
  alertaEn: 80, // % para alertar (80% del límite)
  activo: true,
  mes: 11,
  anio: 2024,
  createdAt: '2024-02-15T00:00:00Z',
  updatedAt: '2024-11-09T00:00:00Z'
}
```

**Estados Automáticos:**
- `ok`: < 50% gastado (verde)
- `neutral`: 50-79% gastado (amarillo)
- `warning`: 80-99% gastado (naranja)
- `danger`: ≥ 100% gastado (rojo)

**Auto-Reinicio:**
- Cada inicio de mes, `montoGastado` vuelve a 0
- Se mantiene el `montoLimite`

---

### 🏆 Logro (Achievement)
```javascript
{
  id: 'logro_racha_7_dias',
  perfilId: 'perfil_001',
  nombre: 'Constante',
  descripcion: 'Registra transacciones durante 7 días seguidos',
  icono: '🔥',
  tipo: 'racha',
  condicion: 'racha_dias',
  desbloqueado: false,
  fechaDesbloqueo: null,
  progreso: 5, // Días actuales
  meta: 7 // Días necesarios
}
```

**Tipos de Logros:**
- `registro`: Basados en cantidad de transacciones
- `racha`: Basados en días consecutivos activos
- `ahorro`: Basados en cantidad ahorrada
- `presupuesto`: Basados en cumplimiento de presupuestos

---

### 🔔 Notificacion (Notification)
```javascript
{
  id: 'notif_002',
  userId: 'user_001',
  perfilId: 'perfil_001',
  tipo: 'error', // 'info' | 'warning' | 'success' | 'error' | 'logro' | 'presupuesto'
  titulo: 'Presupuesto: Suscripciones',
  mensaje: '¡Tomar medidas! Has excedido el presupuesto.',
  icono: '⚠️',
  leida: false,
  accionUrl: '/presupuestos', // URL a la que redirigir
  data: { presupuestoId: 'pres_003' },
  createdAt: '2024-11-09T12:00:00Z'
}
```

**Cuándo se Generan:**
1. Al ejecutarse una transacción programada
2. Al desbloquear un logro
3. Al exceder un presupuesto (80% y 100%)
4. Al acercarse la fecha de un pago importante

---

## ⚙️ Flujo de Ejecución del Sistema

### 🔄 1. Ejecución Automática de Transacciones

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA SCHEDULER                             │
│              (se ejecuta cada hora o minuto)                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ├─► ¿Hay ingresos con proximaEjecucion <= ahora?
                            │   │
                            │   ├─► SÍ → Crear RegistroHistorial
                            │   │      → Marcar como ejecutado
                            │   │      → Calcular próxima ejecución
                            │   │      → Crear Notificación
                            │   │
                            │   └─► NO → Continuar
                            │
                            └─► ¿Hay egresos con proximaEjecucion <= ahora?
                                │
                                ├─► SÍ → Crear RegistroHistorial
                                │      → Actualizar Presupuesto correspondiente
                                │      → Verificar si excede límite
                                │      → Crear Notificación si es necesario
                                │      → Marcar como ejecutado
                                │
                                └─► NO → Continuar
```

### 📥 2. Usuario Registra un Nuevo Egreso

```
Usuario llena formulario "Nuevo Egreso"
    │
    ├─► Descripción: "Netflix"
    ├─► Monto: $15.99
    ├─► Frecuencia: Mensual
    ├─► Día del mes: 10
    └─► Notificación: No
                │
                ▼
Sistema crea objeto Egreso
    │
    ├─► Aplica clasificaciónIA()
    │   └─► Detecta "netflix" → categoria = "Suscripciones"
    │
    ├─► Calcula proximaEjecucion()
    │   └─► proximaEjecucion = "2024-12-10T00:00:00Z"
    │
    └─► Guarda en MockDatabase.egresos[]
                │
                ▼
Egreso guardado y programado ✅
```

### 📊 3. Sistema Actualiza Presupuesto

```
Egreso se ejecuta (ej: Netflix $15.99)
    │
    ▼
Sistema busca Presupuesto con categoria = "Suscripciones"
    │
    ├─► Presupuesto encontrado
    │   │
    │   ├─► Incrementa montoGastado: $40 → $55.99
    │   │
    │   ├─► Calcula porcentajeGastado: (55.99 / 50) * 100 = 111.98%
    │   │
    │   ├─► Determina estado: "danger" (excedido)
    │   │
    │   └─► Genera Notificación
    │       ├─► tipo: "error"
    │       ├─► título: "Presupuesto: Suscripciones"
    │       └─► mensaje: "¡Tomar medidas! Has excedido el presupuesto."
    │
    └─► Presupuesto NO encontrado → Solo registra en historial
```

### 🏆 4. Sistema Verifica Logros

```
Usuario realiza acción (ej: registra primer ingreso)
    │
    ▼
Sistema verifica logros pendientes del perfil
    │
    ├─► Logro: "Primer Paso" (registrar primer ingreso)
    │   │
    │   ├─► Condición: primer_ingreso
    │   ├─► Progreso actual: 0
    │   ├─► Meta: 1
    │   │
    │   ├─► Incrementa progreso: 0 → 1
    │   │
    │   ├─► ¿Progreso >= Meta? SÍ
    │   │
    │   ├─► Desbloquea logro
    │   │   ├─► desbloqueado = true
    │   │   └─► fechaDesbloqueo = ahora
    │   │
    │   └─► Genera Notificación
    │       ├─► tipo: "logro"
    │       ├─► título: "🏆 ¡Nuevo Logro Desbloqueado!"
    │       └─► mensaje: "Has desbloqueado 'Primer Paso'"
    │
    └─► Continúa verificando otros logros...
```

---

## 🎮 Usuarios de Prueba (MockDatabase)

### Usuario 1: Admin
```javascript
{
  correo: 'admin@finaizen.com',
  nombreUsuario: 'admin',
  contraseña: 'admin123',
  rol: 'admin'
}
```

### Usuario 2: María González (Usuario Regular)
```javascript
{
  correo: 'maria@example.com',
  nombreUsuario: 'maria.gonzalez',
  contraseña: 'maria123',
  rol: 'user',
  perfiles: [
    { nombre: 'Personal', ingresos: 3, egresos: 6, presupuestos: 4 },
    { nombre: 'Negocio', ingresos: 0, egresos: 0, presupuestos: 0 }
  ]
}
```

### Usuario 3: Carlos Ramírez
```javascript
{
  correo: 'carlos@example.com',
  nombreUsuario: 'carlos.ramirez',
  contraseña: 'carlos123',
  rol: 'user',
  perfiles: [
    { nombre: 'Personal', ingresos: 0, egresos: 0, presupuestos: 0 }
  ]
}
```

---

## 📈 Estadísticas Calculadas (Dashboard)

### Ahorro Mensual
```javascript
const ahorroMensual = totalIngresos - totalEgresos;
```

### Distribución de Egresos (Gráfico Circular)
```javascript
const distribucion = {
  'Vivienda': 500,
  'Comida': 320,
  'Transporte': 45,
  'Suscripciones': 55,
  'Servicios': 80
};
```

### Tendencia de Ahorro (Gráfico de Líneas)
```javascript
const tendencia = [
  { mes: 'Mayo', ahorro: 400 },
  { mes: 'Junio', ahorro: 600 },
  { mes: 'Julio', ahorro: 800 },
  { mes: 'Agosto', ahorro: 700 },
  { mes: 'Septiembre', ahorro: 900 },
  { mes: 'Octubre', ahorro: 1200 }
];
```

---

## 🔐 Seguridad y Permisos

### Roles del Sistema

#### Usuario Regular (`user`)
**Puede:**
- ✅ Ver/editar sus propios perfiles
- ✅ Crear/editar/eliminar ingresos y egresos
- ✅ Ver historial de transacciones
- ✅ Gestionar presupuestos
- ✅ Ver logros y notificaciones

**NO Puede:**
- ❌ Ver datos de otros usuarios
- ❌ Acceder a panel de administración
- ❌ Ver inteligencia de mercado

#### Administrador (`admin`)
**Puede:**
- ✅ Todo lo que puede un usuario regular
- ✅ Ver estadísticas globales del sistema
- ✅ Análisis de inteligencia de mercado
- ✅ Gestión de usuarios
- ✅ Registro de seguridad
- ✅ Reportes y soporte

---

## 🚀 Cómo Usar el Sistema

### 1. Inicializar la Base de Datos
```javascript
import mockDB from './utils/mockDatabase';

// La base de datos ya está cargada con usuarios de prueba
console.log(mockDB.users); // 3 usuarios
console.log(mockDB.perfiles); // 3 perfiles
console.log(mockDB.ingresos); // 3 ingresos
console.log(mockDB.egresos); // 6 egresos
```

### 2. Login
```javascript
const result = mockDB.login('maria@example.com', 'maria123');

if (result.success) {
  console.log('Usuario autenticado:', result.user);
  console.log('Perfil activo:', result.perfil);
  // mockDB.currentUser y mockDB.currentPerfil están seteados
}
```

### 3. Obtener Datos del Perfil Actual
```javascript
const perfilId = mockDB.currentPerfil.id;

const ingresos = mockDB.getIngresosDePerf(perfilId);
const egresos = mockDB.getEgresosDePerf(perfilId);
const historial = mockDB.getHistorialDePerfil(perfilId, 11, 2024);
const presupuestos = mockDB.getPresupuestosDePerfil(perfilId);
const logros = mockDB.getLogrosDePerfil(perfilId);
```

### 4. Crear un Nuevo Ingreso
```javascript
import Ingreso from './models/Ingreso';

const nuevoIngreso = new Ingreso({
  id: `ing_${Date.now()}`,
  perfilId: mockDB.currentPerfil.id,
  monto: 500,
  descripcion: 'Venta de producto',
  categoria: 'Venta',
  frecuencia: 'ocasional',
  fechaEspecifica: new Date()
});

mockDB.ingresos.push(nuevoIngreso);
mockDB.currentPerfil.agregarIngreso(nuevoIngreso.id);
```

### 5. Ejecutar Scheduler (Simulación)
```javascript
// En un useEffect con setInterval:
const scheduler = setInterval(() => {
  const ahora = new Date();
  
  // Verificar ingresos
  mockDB.ingresos.forEach(ingreso => {
    if (ingreso.debeEjecutarse()) {
      // Crear registro en historial
      const registro = RegistroHistorial.fromIngreso(ingreso, ingreso.perfilId);
      mockDB.historial.push(registro);
      
      // Marcar como ejecutado
      ingreso.marcarComoEjecutado();
      
      // Crear notificación
      const notif = Notificacion.crearNotificacionTransaccion(
        mockDB.currentUser.id,
        ingreso.perfilId,
        ingreso,
        'ingreso'
      );
      mockDB.notificaciones.push(notif);
    }
  });
  
  // Similar para egresos...
}, 60000); // Cada minuto
```

---

## 🎓 Conceptos Clave del Sistema

### 1. Separación de Transacciones Programadas vs Historial
- **Ingreso/Egreso**: Plantilla de transacción recurrente (ej: "Salario cada 5 del mes")
- **RegistroHistorial**: Instancia ya ejecutada (ej: "Salario recibido el 5 de noviembre")

### 2. Auto-clasificación con IA
```javascript
egreso.descripcion = "Pago de Netflix";
egreso.clasificarConIA(); // → categoria = "Suscripciones"
```

### 3. Presupuestos Auto-actualizables
```javascript
// Cuando un egreso de "Comida" se ejecuta:
const presupuestoComida = mockDB.presupuestos.find(p => p.categoria === 'Comida');
presupuestoComida.agregarGasto(egreso.monto);

if (presupuestoComida.porcentajeGastado >= 80) {
  // Generar notificación de advertencia
}
```

### 4. Sistema de Logros Dinámico
```javascript
// Al registrar una transacción:
const logroRacha = mockDB.logros.find(l => l.condicion === 'racha_dias');
logroRacha.actualizarProgreso(diasConsecutivos);

if (logroRacha.desbloqueado) {
  // Mostrar animación de logro desbloqueado
}
```

---

## 📦 Resumen de Archivos Creados

```
src/
├── models/
│   ├── User.js              ✅ Modelo de Usuario
│   ├── Perfil.js            ✅ Modelo de Perfil Financiero
│   ├── Ingreso.js           ✅ Modelo de Ingreso
│   ├── Egreso.js            ✅ Modelo de Egreso
│   ├── RegistroHistorial.js ✅ Modelo de Registro Histórico
│   ├── Presupuesto.js       ✅ Modelo de Presupuesto
│   ├── Logro.js             ✅ Modelo de Logro
│   ├── Notificacion.js      ✅ Modelo de Notificación
│   └── index.js             ✅ Barrel export
│
└── utils/
    └── mockDatabase.js      ✅ Base de Datos Mock con Seed Data
```

---

## 🎯 Próximos Pasos

1. **Integrar mockDB con React Context** para compartir estado global
2. **Crear hooks personalizados**:
   - `useAuth()` - Login/Logout/Register
   - `usePerfiles()` - Gestión de perfiles
   - `useTransacciones()` - CRUD de ingresos/egresos
   - `usePresupuestos()` - Gestión de presupuestos
   - `useScheduler()` - Ejecutar transacciones programadas
3. **Implementar páginas del dashboard** con datos reales del mockDB
4. **Añadir persistencia con localStorage** (opcional)
5. **Implementar sistema de notificaciones en tiempo real**

---

## 💡 Ventajas de Esta Arquitectura

✅ **Escalable**: Fácil agregar nuevos modelos  
✅ **Mantenible**: Cada clase tiene responsabilidad única  
✅ **Testeable**: Datos mock permiten desarrollo sin backend  
✅ **Tipado**: Clases con propiedades bien definidas  
✅ **Realista**: Simula comportamiento de base de datos real  
✅ **Profesional**: Sigue patrones OOP estándar  

---

**¡Sistema completo y listo para usar en React!** 🚀
