/**
 * rolesData.js
 * Datos mock para gestión de roles y permisos
 */

export const allPermissions = [
  'Acceso Total',
  'Ver Dashboard',
  'Gestionar Usuarios',
  'Gestionar Roles',
  'Ver Inteligencia de Mercado',
  'Exportar CSV',
  'Supervisar Categorías IA',
  'Crear Reglas de IA',
  'Ver Métricas del Modelo',
  'Gestionar Reportes de Soporte',
  'Ver Perfil Limitado',
  'Acceder a Registros de Seguridad'
];

export const initialRoles = [
  {
    id: 1,
    name: 'Administrador de TI',
    userCount: 2,
    permissions: ['Acceso Total'],
    protected: true
  },
  {
    id: 2,
    name: 'Analista de Datos',
    userCount: 3,
    permissions: ['Ver Inteligencia de Mercado', 'Exportar CSV', 'Ver Dashboard']
  },
  {
    id: 3,
    name: 'Supervisor de IA',
    userCount: 1,
    permissions: ['Supervisar Categorías IA', 'Crear Reglas de IA', 'Ver Métricas del Modelo']
  },
  {
    id: 4,
    name: 'Agente de Soporte',
    userCount: 5,
    permissions: ['Gestionar Reportes de Soporte', 'Ver Perfil Limitado']
  }
];
