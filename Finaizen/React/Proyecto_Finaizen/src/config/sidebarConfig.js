/**
 * Configuración compartida de menús del sidebar para usuario
 */

export const userSidebarMenuItems = [
  { label: 'Dashboard', path: '/user/dashboard' },
  { label: 'Administrador ingresos/egresos', path: '/user/administrar-registros' },
  { label: 'Plan de Ahorros', path: '/user/plan-ahorro' },
  { label: 'Ajuste de presupuestos', path: '/user/presupuestos' },
  { label: 'Planificador de deudas', path: '/user/planificador-deudas' },
  { label: 'Logros y Recompensas', path: '/user/logros' },
];

export const userDropdownMenuItems = [
  { icon: '👤', label: 'Mi Cuenta', path: '/user/config/cuenta' },
  { icon: '🎭', label: 'Perfiles', path: '/user/config/perfiles' },
  { icon: '🔔', label: 'Notificaciones', path: '/user/config/notificaciones' },
  { icon: '🔒', label: 'Seguridad', path: '/user/config/seguridad' },
  { icon: '❓', label: 'Ayuda', path: '/user/config/ayuda' },
];
