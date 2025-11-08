const legacyRouteGroups = [
  {
    title: 'Experiencia pública',
    routes: [
      {
        path: '/legacy/base',
        title: 'Página principal',
        htmlPath: '/legacy/pages/Base/index.html',
      },
      {
        path: '/legacy/base/login',
        title: 'Inicio de sesión',
        htmlPath: '/legacy/pages/Base/login.html',
      },
      {
        path: '/legacy/base/register',
        title: 'Registro',
        htmlPath: '/legacy/pages/Base/register.html',
      },
    ],
  },
  {
    title: 'Panel administrador',
    routes: [
      {
        path: '/legacy/admin/dashboard',
        title: 'Dashboard general',
        htmlPath: '/legacy/pages/Admin/dashboard.html',
      },
      {
        path: '/legacy/admin/gestion-usuarios',
        title: 'Gestión de usuarios',
        htmlPath: '/legacy/pages/Admin/gestion-usuarios.html',
      },
      {
        path: '/legacy/admin/gestion-roles',
        title: 'Gestión de roles',
        htmlPath: '/legacy/pages/Admin/gestion-roles.html',
      },
      {
        path: '/legacy/admin/inteligencia-mercado',
        title: 'Inteligencia de mercado',
        htmlPath: '/legacy/pages/Admin/inteligencia-mercado.html',
      },
      {
        path: '/legacy/admin/reportes-soporte',
        title: 'Reportes y soporte',
        htmlPath: '/legacy/pages/Admin/reportes-soporte.html',
      },
      {
        path: '/legacy/admin/registro-seguridad',
        title: 'Registro de seguridad',
        htmlPath: '/legacy/pages/Admin/registro-seguridad.html',
      },
      {
        path: '/legacy/admin/supervision-categorias',
        title: 'Supervisión de categorías',
        htmlPath: '/legacy/pages/Admin/supervision-categorias.html',
      },
    ],
  },
  {
    title: 'Panel usuario',
    routes: [
      {
        path: '/legacy/user/dashboard',
        title: 'Dashboard personal',
        htmlPath: '/legacy/pages/User/dashboard.html',
      },
      {
        path: '/legacy/user/administrar-registros',
        title: 'Administrar registros',
        htmlPath: '/legacy/pages/User/administrar_registros.html',
      },
      {
        path: '/legacy/user/historial',
        title: 'Historial financiero',
        htmlPath: '/legacy/pages/User/historial.html',
      },
      {
        path: '/legacy/user/nuevo-ingreso',
        title: 'Nuevo ingreso',
        htmlPath: '/legacy/pages/User/nuevo-ingreso.html',
      },
      {
        path: '/legacy/user/nuevo-egreso',
        title: 'Nuevo egreso',
        htmlPath: '/legacy/pages/User/nuevo-egreso.html',
      },
      {
        path: '/legacy/user/presupuestos',
        title: 'Presupuestos',
        htmlPath: '/legacy/pages/User/presupuestos.html',
      },
      {
        path: '/legacy/user/plan-ahorro',
        title: 'Plan de ahorro',
        htmlPath: '/legacy/pages/User/plan_ahorro.html',
      },
      {
        path: '/legacy/user/planificador-deudas',
        title: 'Planificador de deudas',
        htmlPath: '/legacy/pages/User/planificador_deudas.html',
      },
      {
        path: '/legacy/user/logros',
        title: 'Logros y gamificación',
        htmlPath: '/legacy/pages/User/logros.html',
      },
      {
        path: '/legacy/user/config-cuenta',
        title: 'Configuración de cuenta',
        htmlPath: '/legacy/pages/User/config_cuenta.html',
      },
      {
        path: '/legacy/user/config-seguridad',
        title: 'Configuración de seguridad',
        htmlPath: '/legacy/pages/User/config_seguridad.html',
      },
      {
        path: '/legacy/user/config-perfiles',
        title: 'Perfiles compartidos',
        htmlPath: '/legacy/pages/User/config_perfiles.html',
      },
      {
        path: '/legacy/user/config-notificaciones',
        title: 'Notificaciones',
        htmlPath: '/legacy/pages/User/config_notificaciones.html',
      },
      {
        path: '/legacy/user/config-ayuda',
        title: 'Centro de ayuda',
        htmlPath: '/legacy/pages/User/config_ayuda.html',
      },
    ],
  },
];

const legacyRouteMap = legacyRouteGroups
  .flatMap((group) => group.routes)
  .reduce((acc, route) => {
    acc[route.path] = route;
    return acc;
  }, {});

export { legacyRouteMap };
export default legacyRouteGroups;
