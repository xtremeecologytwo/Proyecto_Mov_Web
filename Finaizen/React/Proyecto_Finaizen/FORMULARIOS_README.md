# Formularios de Ingresos y Egresos - Implementación React

## 📋 Descripción General

Sistema de formularios reutilizables para registro de transacciones financieras (Ingresos y Egresos) implementado siguiendo las mejores prácticas de React.

## ✅ Principios de React Aplicados

### 1. **Componentes Funcionales con Hooks**
- Todos los componentes usan funciones en lugar de clases
- Uso extensivo de hooks: `useState`, `useEffect`, `useNavigate`, `useAuth`

```jsx
function TransactionForm({ type, onSubmitSuccess }) {
  const [formData, setFormData] = useState({...});
  const [toast, setToast] = useState(null);
  const { currentPerfil } = useAuth();
  
  useEffect(() => {
    // Validar autenticación
  }, [currentPerfil]);
  
  return (...);
}
```

### 2. **Formularios Controlados (Controlled Components)**
- Todos los inputs están vinculados al estado mediante `value` y `onChange`
- El estado es la única fuente de verdad (single source of truth)

```jsx
<input
  type="text"
  name="descripcion"
  value={formData.descripcion}
  onChange={handleInputChange}
/>
```

### 3. **Manejo de Estado con useState**
- Estado local para datos del formulario
- Estado para errores de validación
- Estado para notificaciones (Toast)

```jsx
const [formData, setFormData] = useState({
  monto: '0.00',
  descripcion: '',
  categoria: 'Otros',
  frecuencia: 'ocasional',
  // ... más campos
});

const [errors, setErrors] = useState({});
const [toast, setToast] = useState(null);
```

### 4. **Efectos Secundarios con useEffect**
- Validación de autenticación al montar el componente
- Auto-cerrar Toast después de un tiempo
- Actualizar valores dependientes cuando cambia el estado

```jsx
// Validar autenticación
useEffect(() => {
  if (!authLoading && !currentPerfil) {
    navigate('/login');
  }
}, [currentPerfil, authLoading, navigate]);

// Auto-actualizar día del mes
useEffect(() => {
  if (formData.frecuencia === 'mensual' && !formData.diaMes) {
    setFormData(prev => ({ ...prev, diaMes: 1 }));
  }
}, [formData.frecuencia, formData.diaMes]);
```

### 5. **Manejo de Eventos (onChange / onSubmit)**
- Funciones manejadoras para cada tipo de evento
- Actualización inmediata del estado
- Prevención de comportamiento por defecto en formularios

```jsx
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Guardar transacción
};
```

### 6. **Validación de Props con PropTypes**
- Validación de tipos en tiempo de desarrollo
- Documentación implícita de la API del componente

```jsx
TransactionForm.propTypes = {
  type: PropTypes.oneOf(['ingreso', 'egreso']).isRequired,
  onSubmitSuccess: PropTypes.func
};

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};
```

### 7. **Lifting State Up (Elevación del Estado)**
- Comunicación con componentes padres mediante callbacks
- El componente padre puede reaccionar al éxito del formulario

```jsx
// En TransactionForm
const handleSubmit = (e) => {
  e.preventDefault();
  // ... crear transacción
  
  // Notificar al componente padre
  if (onSubmitSuccess) {
    onSubmitSuccess(transaction);
  }
};

// En NuevoIngreso
function NuevoIngreso() {
  const handleSuccess = (ingreso) => {
    console.log('Ingreso creado:', ingreso);
    // Aquí el padre puede actualizar su propio estado
  };
  
  return <TransactionForm type="ingreso" onSubmitSuccess={handleSuccess} />;
}
```

### 8. **Jerarquía de Componentes Clara**
```
NuevoIngreso / NuevoEgreso (Páginas)
  └── TransactionForm (Form Logic)
       ├── Sidebar (Layout)
       ├── Button (UI)
       ├── Input (UI)
       └── Toast (Notifications)
```

### 9. **Sistema de Notificaciones Local**
- Componente Toast reutilizable
- Notificaciones temporales con auto-cierre
- Diferentes tipos: success, error, warning, info

```jsx
// Mostrar notificación
setToast({
  type: 'success',
  message: '✓ Ingreso registrado exitosamente'
});

// Componente Toast se auto-cierra después de 5 segundos
{toast && (
  <Toast
    type={toast.type}
    message={toast.message}
    onClose={() => setToast(null)}
    duration={5000}
  />
)}
```

### 10. **Paso de Datos con Props**
- Comunicación unidireccional de padre a hijo
- Props tipadas y validadas

```jsx
<TransactionForm 
  type="ingreso"              // Define el tipo de formulario
  onSubmitSuccess={handler}   // Callback para comunicación ascendente
/>
```

## 🎨 Estructura de Archivos

```
src/
├── components/
│   ├── forms/
│   │   └── TransactionForm/
│   │       ├── TransactionForm.jsx         # Lógica del formulario
│   │       ├── TransactionForm.module.css  # Estilos CSS Modules
│   │       └── index.js                    # Barrel export
│   ├── ui/
│   │   ├── Toast/
│   │   │   ├── Toast.jsx                   # Componente de notificación
│   │   │   ├── Toast.module.css
│   │   │   └── index.js
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   └── layout/
│       └── Sidebar/
├── pages/
│   └── User/
│       ├── NuevoIngreso/
│       │   ├── NuevoIngreso.jsx            # Página de ingreso
│       │   └── index.js
│       └── NuevoEgreso/
│           ├── NuevoEgreso.jsx             # Página de egreso
│           └── index.js
└── models/
    ├── Ingreso.js                          # Modelo de datos
    ├── Egreso.js                           # Modelo de datos
    └── index.js
```

## 🔄 Flujo de Datos

```
1. Usuario interactúa con input
   └─> onChange handler
       └─> Actualiza estado (setFormData)
           └─> Re-render del componente
               └─> Input muestra nuevo valor

2. Usuario envía formulario
   └─> onSubmit handler
       └─> Validación (validateForm)
           ├─> Error: Muestra Toast de error
           └─> Éxito: Crea transacción
               ├─> Guarda en mockDB
               ├─> Muestra Toast de éxito
               ├─> Ejecuta callback onSubmitSuccess
               └─> Resetea formulario
```

## 📝 Características Implementadas

### Formulario Reutilizable
- ✅ Un solo componente sirve para Ingresos Y Egresos
- ✅ Configuración mediante prop `type`
- ✅ Campos dinámicos según tipo de transacción

### Validación Completa
- ✅ Validación en tiempo real
- ✅ Mensajes de error específicos por campo
- ✅ Validación al enviar
- ✅ Limpieza de errores al corregir

### Selección de Frecuencia
- ✅ Diario, Semanal, Mensual, Anual, Ocasional
- ✅ Selectores dinámicos según frecuencia
- ✅ Checkbox de días de semana
- ✅ Calendario de días del mes (1-31)
- ✅ Selector de fecha específica

### Sistema de Notificaciones
- ✅ Toast con tipos: success, error, warning, info
- ✅ Auto-cierre configurable
- ✅ Animaciones de entrada/salida
- ✅ Responsive

### Clasificación de Egresos
- ✅ Prioritario / Secundario
- ✅ Solo visible en formulario de egresos

### Integración con mockDB
- ✅ Guarda en base de datos simulada
- ✅ Genera IDs auto-incrementales
- ✅ Vincula con perfil actual
- ✅ Usa modelos de datos definidos

## 🚀 Uso

### Página de Nuevo Ingreso
```jsx
import NuevoIngreso from './pages/User/NuevoIngreso';

<Route path="/user/nuevo-ingreso" element={<NuevoIngreso />} />
```

### Página de Nuevo Egreso
```jsx
import NuevoEgreso from './pages/User/NuevoEgreso';

<Route path="/user/nuevo-egreso" element={<NuevoEgreso />} />
```

### Uso Directo del Componente
```jsx
import TransactionForm from './components/forms/TransactionForm';

function MiComponente() {
  const handleSuccess = (transaction) => {
    console.log('Transacción creada:', transaction);
    // Actualizar estado padre, navegar, etc.
  };

  return (
    <TransactionForm 
      type="ingreso"              // o "egreso"
      onSubmitSuccess={handleSuccess}
    />
  );
}
```

## 🎯 Validaciones Implementadas

| Campo | Validación |
|-------|------------|
| Monto | Debe ser mayor a 0, numérico |
| Descripción | Requerido, no vacío |
| Frecuencia Semanal | Al menos 1 día seleccionado |
| Frecuencia Mensual | Día del mes entre 1-31 |
| Frecuencia Anual/Ocasional | Fecha específica requerida |
| Notificación | Si activa, hora requerida |

## 📊 Datos Guardados

Al enviar el formulario, se crea un objeto con la siguiente estructura:

```javascript
{
  id: 1,                          // Auto-generado
  perfilId: 1,                    // Del perfil actual
  monto: 100.50,                  // Parseado a float
  descripcion: "Salario mensual",
  categoria: "Salario",
  frecuencia: "mensual",
  diasSemana: [],                 // [0-6] para semanal
  diaMes: 5,                      // 1-31 para mensual
  fechaEspecifica: Date,          // Para anual/ocasional
  horaNotificacion: "09:00",
  notificacionActiva: true,
  activo: true,
  proximaEjecucion: Date,         // Calculado automáticamente
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Estilos

- CSS Modules para scoping
- Diseño responsive (Desktop, Tablet, Mobile)
- Tema consistente con el resto de la aplicación
- Transiciones y animaciones suaves

## 🔐 Seguridad

- ✅ Validación en cliente antes de enviar
- ✅ Protección de rutas (requiere autenticación)
- ✅ Sanitización de inputs
- ✅ Prevención de valores negativos/inválidos

## 📱 Responsive

- Desktop: Grid de 2 columnas
- Tablet: Grid de 1 columna
- Mobile: Layout vertical, botones full-width

## 🧪 Testing Recomendado

```javascript
// Pruebas sugeridas:
- Validación de campos vacíos
- Validación de monto negativo/cero
- Cambio de frecuencia actualiza selectores
- Toast se auto-cierra después de 5s
- Callback onSubmitSuccess se ejecuta
- Formulario se resetea después de guardar
- Navegación a dashboard al cancelar
```

## 🎓 Aprendizajes Clave

1. **Formularios controlados** son más predecibles y fáciles de validar
2. **Lifting state up** permite comunicación entre componentes
3. **useEffect** es ideal para sincronización y efectos secundarios
4. **PropTypes** ayuda a detectar errores tempranamente
5. **Composición** > Herencia (componentes reutilizables)
6. **Single Responsibility**: Cada componente tiene un propósito claro

## 📚 Referencias

- [React Docs - Forms](https://react.dev/learn/managing-state#sharing-state-between-components)
- [React Docs - Hooks](https://react.dev/reference/react)
- [PropTypes](https://www.npmjs.com/package/prop-types)
