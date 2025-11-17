# FloatingActionButton (FAB)

Componente de botón flotante circular con menú desplegable de acciones rápidas.

## Características

- ✅ **Botón circular flotante** con icono `+` que rota a `✕` al abrir
- ✅ **Menú desplegable** con múltiples opciones
- ✅ **Overlay oscuro** que cierra el menú al hacer click
- ✅ **Animaciones suaves** para transiciones
- ✅ **Responsive** con ajustes para móvil
- ✅ **Posicionamiento flexible** (4 esquinas disponibles)
- ✅ **Temas de color** (primary, success, danger, warning)
- ✅ **Navegación automática** con React Router

## Uso Básico

```jsx
import { FloatingActionButton } from '../../../components/ui';

function MyPage() {
  const menuItems = [
    { icon: '💰', label: 'Nuevo Ingreso', path: '/user/nuevo-ingreso' },
    { icon: '💸', label: 'Nuevo Egreso', path: '/user/nuevo-egreso' },
    { icon: '📋', label: 'Historial', path: '/user/historial' }
  ];

  return (
    <div>
      {/* Tu contenido */}
      
      <FloatingActionButton 
        menuItems={menuItems}
        position="bottom-right"
        color="primary"
      />
    </div>
  );
}
```

## Props

### `menuItems` (Array) - **Requerido**

Array de objetos que definen las opciones del menú.

**Estructura de cada item:**
```javascript
{
  icon: string,      // Emoji o icono (requerido)
  label: string,     // Texto de la opción (requerido)
  path: string,      // Ruta de navegación (opcional)
  disabled: boolean  // Deshabilitar opción (opcional, default: false)
}
```

**Ejemplo:**
```javascript
const menuItems = [
  { icon: '➕', label: 'Crear Nuevo', path: '/create' },
  { icon: '📝', label: 'Editar', path: '/edit' },
  { icon: '🗑️', label: 'Eliminar', path: '/delete', disabled: true }
];
```

### `position` (String)

Posición del botón en la pantalla.

**Opciones:**
- `'bottom-right'` (default)
- `'bottom-left'`
- `'top-right'`
- `'top-left'`

**Ejemplo:**
```jsx
<FloatingActionButton 
  menuItems={items}
  position="bottom-left"
/>
```

### `color` (String)

Tema de color del botón.

**Opciones:**
- `'primary'` (default) - Verde azulado (#0f766e → #14b8a6)
- `'success'` - Verde (#059669 → #10b981)
- `'danger'` - Rojo (#dc2626 → #ef4444)
- `'warning'` - Naranja (#d97706 → #f59e0b)

**Ejemplo:**
```jsx
<FloatingActionButton 
  menuItems={items}
  color="success"
/>
```

## Ejemplos de Uso

### Dashboard de Usuario
```jsx
const fabMenuItems = [
  { icon: '💰', label: 'Nuevo Ingreso', path: '/user/nuevo-ingreso' },
  { icon: '💸', label: 'Nuevo Egreso', path: '/user/nuevo-egreso' },
  { icon: '📋', label: 'Historial', path: '/user/historial' }
];

<FloatingActionButton 
  menuItems={fabMenuItems}
  position="bottom-right"
  color="primary"
/>
```

### Panel de Administración
```jsx
const adminActions = [
  { icon: '👤', label: 'Nuevo Usuario', path: '/admin/users/new' },
  { icon: '🏷️', label: 'Nueva Categoría', path: '/admin/categories/new' },
  { icon: '📊', label: 'Generar Reporte', path: '/admin/reports/new' }
];

<FloatingActionButton 
  menuItems={adminActions}
  position="bottom-right"
  color="warning"
/>
```

### Configuración con Acciones Deshabilitadas
```jsx
const settingsActions = [
  { icon: '💾', label: 'Guardar Cambios', path: '/save' },
  { icon: '↩️', label: 'Restaurar', path: '/restore' },
  { icon: '🗑️', label: 'Eliminar Todo', path: '/delete-all', disabled: true }
];

<FloatingActionButton 
  menuItems={settingsActions}
  position="top-right"
  color="danger"
/>
```

## Comportamiento

### Desktop
- Tamaño del botón: **64x64 px**
- Menú aparece a **80px** del botón
- Hover effect con escala 1.05
- Menú se desliza hacia arriba con animación

### Mobile (≤ 768px)
- Tamaño del botón: **56x56 px**
- Menú aparece a **72px** del botón
- Touch-friendly spacing
- Overlay táctil para cerrar

### Responsive Breakpoints
- **Desktop:** `> 768px`
- **Tablet/Mobile:** `≤ 768px`
- **Small Mobile:** `≤ 480px`

## Accesibilidad

- ✅ `aria-label="Acciones rápidas"`
- ✅ `aria-expanded` dinámico según estado
- ✅ Cierre con overlay clickeable
- ✅ Estados hover y active bien definidos
- ✅ Soporte para opciones deshabilitadas

## Notas Técnicas

- Usa `position: fixed` para estar siempre visible
- Z-index: **999** (container) y **1001** (botón)
- Navegación con `useNavigate()` de React Router
- CSS Modules para estilos aislados
- PropTypes para validación de props

## Customización

### Cambiar Colores
Edita `FloatingActionButton.module.css`:
```css
.fab.myCustomColor {
  background: linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%);
}
```

Luego en el componente:
```jsx
<FloatingActionButton color="myCustomColor" />
```

### Añadir Nueva Posición
```css
.my_custom_position {
  bottom: 50%;
  right: 0;
  transform: translateY(50%);
}
```

## Integración con Otras Páginas

Para usar en otras páginas, simplemente importa y usa:

```jsx
import { FloatingActionButton } from '../../components/ui';

// Define tus acciones
const actions = [
  { icon: '🎯', label: 'Acción 1', path: '/path1' },
  { icon: '⚡', label: 'Acción 2', path: '/path2' }
];

// Renderiza
<FloatingActionButton menuItems={actions} />
```

## Estado del Componente

El componente maneja su propio estado interno:
- `isOpen`: Controla si el menú está visible
- Cierre automático al hacer click en opción
- Cierre con overlay o botón `✕`
