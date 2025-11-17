# PresupuestoCard Component

Componente reutilizable para mostrar tarjetas de presupuesto con indicador de progreso y estado.

## Props

- **presupuesto** (object, required): Objeto con datos del presupuesto
  - `id`: Identificador único
  - `categoria`: Nombre de la categoría
  - `montoGastado`: Monto ya gastado
  - `montoLimite`: Límite máximo del presupuesto
  - `porcentajeGastado`: Porcentaje gastado (0-100+)
  - `estado`: Estado visual ('ok' | 'neutral' | 'warning' | 'danger')

- **simboloMoneda** (string, required): Símbolo de moneda a mostrar (ej: '$', '€', 'S/')

- **onEdit** (function, optional): Callback al hacer click en editar
  - Firma: `(presupuesto) => void`

- **onDelete** (function, optional): Callback al hacer click en eliminar
  - Firma: `(presupuesto) => void`

- **showActions** (boolean, optional): Mostrar botones de editar/eliminar
  - Default: `false`
  - Usar `true` en página de gestión completa
  - Usar `false` en vista de dashboard

- **compact** (boolean, optional): Modo compacto con menos padding y fuentes más pequeñas
  - Default: `false`
  - Usar `true` en dashboard para ahorrar espacio
  - Usar `false` en página de gestión para mejor legibilidad

## Uso

### En Dashboard (compacto, sin acciones)
```jsx
<PresupuestoCard
  presupuesto={presupuesto}
  simboloMoneda="$"
  showActions={false}
  compact={true}
/>
```

### En Página de Presupuestos (completo, con acciones)
```jsx
<PresupuestoCard
  presupuesto={presupuesto}
  simboloMoneda="$"
  onEdit={handleEdit}
  onDelete={handleDelete}
  showActions={true}
  compact={false}
/>
```

## Estados Visuales

- **ok** (verde #81C784): Gasto < 50%
- **neutral** (teal #4DB6AC): Gasto entre 50% y alerta configurada
- **warning** (naranja #FFB74D): Gasto entre alerta y 100%
- **danger** (rojo #E57373): Gasto >= 100%

## Características

- Barra de progreso animada
- Indicador de estado con color
- Mensajes de alerta contextuales
- Efecto hover con elevación
- Responsive (se adapta a mobile)
- Accesible (botones con títulos descriptivos)
