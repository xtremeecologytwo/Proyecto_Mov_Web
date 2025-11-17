# Dashboard Components

Esta carpeta contiene los componentes modulares del Dashboard de Usuario, diseñados para ser reutilizables y mantener una separación clara de responsabilidades.

## Estructura de Componentes

```
dashboard/
├── StatsCards/              # Tarjetas de estadísticas (Ingresos, Egresos, Balance, Logros)
├── ChartsSection/           # Sección de gráficas (PieChart y SimpleBarChart)
├── PresupuestosSection/     # Sección de presupuestos activos
├── TransaccionesRecientes/  # Sección de historial de transacciones
└── index.js                 # Exports centralizados
```

## Componentes

### StatsCards
**Ubicación:** `dashboard/StatsCards/`

Muestra las 4 tarjetas principales del dashboard con las estadísticas financieras del mes actual.

**Props:**
- `stats` (Object): Estadísticas calculadas
  - `totalIngresos` (Number): Total de ingresos del mes
  - `totalEgresos` (Number): Total de egresos del mes
  - `balance` (Number): Balance del mes (ingresos - egresos)
  - `ahorro` (Number|String): Porcentaje de ahorro
- `simboloMoneda` (String): Símbolo de la moneda (ej: "$", "€")
- `logrosDesbloqueados` (Number): Cantidad de logros desbloqueados
- `totalLogros` (Number): Total de logros disponibles

**Ejemplo:**
```jsx
<StatsCards 
  stats={{
    totalIngresos: 1500,
    totalEgresos: 800,
    balance: 700,
    ahorro: 46.7
  }}
  simboloMoneda="$"
  logrosDesbloqueados={5}
  totalLogros={10}
/>
```

---

### ChartsSection
**Ubicación:** `dashboard/ChartsSection/`

Sección responsiva que muestra dos gráficas: PieChart (mes actual) y SimpleBarChart (balance de 6 meses). En móvil/tablet muestra un toggle para alternar entre ambas gráficas.

**Props:**
- `chartDataMonthly` (Array): Datos para la gráfica de pastel (mes actual)
  - `label` (String): Etiqueta (ej: "Ingresos")
  - `value` (Number): Valor numérico
  - `color` (String): Color hexadecimal
- `chartDataBalance` (Array): Datos para la gráfica de barras (últimos 6 meses)
  - `label` (String): Mes (ej: "Jun", "Jul")
  - `value` (Number): Balance del mes
  - `color` (String): Color hexadecimal
  - `ingresos` (Number): Total de ingresos del mes
  - `egresos` (Number): Total de egresos del mes

**Características:**
- Layout responsive (desktop: 2 columnas, móvil: 1 columna con toggle)
- Estado interno para manejo del toggle móvil
- Altura mínima de 450px para ambas gráficas

**Ejemplo:**
```jsx
<ChartsSection 
  chartDataMonthly={[
    { label: 'Ingresos', value: 1700, color: '#10b981' },
    { label: 'Egresos', value: 761, color: '#ef4444' },
    { label: 'Balance', value: 938, color: '#14b8a6' }
  ]}
  chartDataBalance={[
    { label: 'Jun', value: 500, color: '#14b8a6', ingresos: 1200, egresos: 700 },
    // ... más meses
  ]}
/>
```

---

### PresupuestosSection
**Ubicación:** `dashboard/PresupuestosSection/`

Muestra los presupuestos activos del perfil actual (máximo 3 en el dashboard).

**Props:**
- `presupuestos` (Array): Lista de presupuestos
  - `id` (String): ID único del presupuesto
  - `categoria` (String): Categoría del presupuesto
  - `montoLimite` (Number): Límite presupuestario
  - `montoGastado` (Number): Monto ya gastado
  - `porcentajeGastado` (Number): Porcentaje gastado
  - `estado` (String): Estado del presupuesto ('ok', 'neutral', 'warning', 'danger')
  - `alertaEn` (Number): Porcentaje de alerta
- `simboloMoneda` (String): Símbolo de la moneda

**Características:**
- Muestra máximo 3 presupuestos
- Botón "Ver todos" si hay más de 0 presupuestos
- Navegación a `/user/presupuestos`
- Usa componente `PresupuestoCard` para cada item

**Ejemplo:**
```jsx
<PresupuestosSection 
  presupuestos={[
    {
      id: '1',
      categoria: 'Alimentación',
      montoLimite: 500,
      montoGastado: 320,
      porcentajeGastado: 64,
      estado: 'neutral',
      alertaEn: 80
    }
  ]}
  simboloMoneda="$"
/>
```

---

### TransaccionesRecientes
**Ubicación:** `dashboard/TransaccionesRecientes/`

Muestra el historial reciente de transacciones (ingresos y egresos).

**Props:**
- `historial` (Array): Lista de transacciones
  - `id` (String): ID único de la transacción
  - `tipo` (String): 'ingreso' o 'egreso'
  - `descripcion` (String): Descripción de la transacción
  - `monto` (Number): Monto de la transacción
  - `fechaEjecucion` (String): Fecha en formato ISO
- `simboloMoneda` (String): Símbolo de la moneda
- `maxItems` (Number, opcional): Número máximo de items a mostrar (default: 8)

**Características:**
- Scroll vertical si hay muchos items
- Hover effect con animación
- Iconos diferenciales para ingresos (💰) y egresos (💸)
- Colores diferenciados (verde para ingresos, rojo para egresos)
- Botón "Ver todo el historial" si hay más items que `maxItems`
- Navegación a `/user/historial`

**Ejemplo:**
```jsx
<TransaccionesRecientes 
  historial={[
    {
      id: '1',
      tipo: 'ingreso',
      descripcion: 'Salario mensual',
      monto: 1500,
      fechaEjecucion: '2025-11-01T10:00:00Z'
    },
    {
      id: '2',
      tipo: 'egreso',
      descripcion: 'Compras supermercado',
      monto: 120,
      fechaEjecucion: '2025-11-02T15:30:00Z'
    }
  ]}
  simboloMoneda="$"
  maxItems={8}
/>
```

---

## Uso en DashboardUser

Todos los componentes están diseñados para ser usados juntos en el `DashboardUser.jsx`:

```jsx
import { StatsCards, ChartsSection, PresupuestosSection, TransaccionesRecientes } from '../../../components/dashboard';

function DashboardUser() {
  // ... lógica del componente
  
  return (
    <div>
      {/* Header */}
      <header>...</header>
      
      {/* Stats Cards */}
      <StatsCards 
        stats={stats}
        simboloMoneda={currentPerfil.simboloMoneda}
        logrosDesbloqueados={logrosDesbloqueados}
        totalLogros={logros.length}
      />
      
      {/* Gráficas */}
      <ChartsSection 
        chartDataMonthly={chartDataMonthly}
        chartDataBalance={chartDataBalance}
      />
      
      {/* Presupuestos y Transacciones */}
      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <PresupuestosSection 
            presupuestos={presupuestos}
            simboloMoneda={currentPerfil.simboloMoneda}
          />
        </div>
        
        <div className={styles.rightColumn}>
          <TransaccionesRecientes 
            historial={historial}
            simboloMoneda={currentPerfil.simboloMoneda}
            maxItems={8}
          />
        </div>
      </div>
    </div>
  );
}
```

## Ventajas de esta Arquitectura

1. **Modularidad:** Cada sección es independiente y reutilizable
2. **Mantenibilidad:** Cambios en una sección no afectan a las demás
3. **Testabilidad:** Cada componente puede ser testeado por separado
4. **Granularidad:** Facilita la comprensión del código y la colaboración
5. **Escalabilidad:** Fácil agregar nuevas secciones al dashboard
6. **Reutilización:** Componentes pueden usarse en otros dashboards o páginas

## Estilos

Cada componente tiene su propio archivo `.module.css` con estilos encapsulados, evitando conflictos de nombres y facilitando el mantenimiento.

## PropTypes

Todos los componentes usan `PropTypes` para validación de props, mejorando la experiencia de desarrollo y detectando errores tempranamente.
