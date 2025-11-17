import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import mockDB from '../../../utils/mockDatabase';
import { FloatingActionButton, Toast } from '../../../components/ui';
import { Sidebar } from '../../../components/layout';
import { StatsCards, ChartsSection, PresupuestosSection, TransaccionesRecientes } from '../../../components/dashboard';
import styles from './DashboardUser.module.css';

/**
 * Dashboard de Usuario
 * Muestra resumen financiero, gráficas y acciones rápidas
 */
function DashboardUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentPerfil, loading: authLoading, logout } = useAuth();

  // Estados
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  // Estadísticas calculadas
  const [stats, setStats] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0,
    ahorro: 0
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    // Esperar a que termine de cargar la autenticación
    if (authLoading) return;

    if (!currentUser || !currentPerfil) {
      navigate('/login');
      return;
    }

    cargarDatos();
  }, [currentUser, currentPerfil, authLoading, navigate]);

  // Mostrar notificación si viene del formulario de transacción
  useEffect(() => {
    if (location.state?.notification) {
      setToast(location.state.notification);
      
      // Limpiar el estado de navegación para evitar mostrar la notificación nuevamente
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const cargarDatos = () => {
    setLoading(true);

    const ing = mockDB.getIngresosDePerf(currentPerfil.id);
    const egr = mockDB.getEgresosDePerf(currentPerfil.id);
    const hist = mockDB.getHistorialDePerfil(currentPerfil.id);
    const pres = mockDB.getPresupuestosDePerfil(currentPerfil.id);
    const logr = mockDB.getLogrosDePerfil(currentPerfil.id);

    setIngresos(ing);
    setEgresos(egr);
    setHistorial(hist);
    setLogros(logr);

    // Calcular estadísticas del mes actual
    const now = new Date();
    const mesActual = now.getMonth() + 1;
    const anioActual = now.getFullYear();

    // Filtrar presupuestos del mes actual
    const presupuestosMesActual = pres.filter(p => 
      p.mes === mesActual && p.anio === anioActual && p.activo
    );

    // Calcular gasto real por categoría del mes actual
    const presupuestosConGastoReal = presupuestosMesActual.map(presupuesto => {
      // Obtener egresos del mes actual para esta categoría
      const gastosCategoria = hist.filter(h => 
        h.tipo === 'egreso' &&
        h.categoria === presupuesto.categoria &&
        h.mes === mesActual &&
        h.anio === anioActual
      );

      const montoGastadoReal = gastosCategoria.reduce((sum, h) => sum + h.monto, 0);

      // Crear un nuevo objeto con el gasto real calculado
      return {
        ...presupuesto,
        montoGastado: montoGastadoReal,
        porcentajeGastado: presupuesto.montoLimite > 0 
          ? (montoGastadoReal / presupuesto.montoLimite) * 100 
          : 0,
        estado: (() => {
          const porcentaje = presupuesto.montoLimite > 0 
            ? (montoGastadoReal / presupuesto.montoLimite) * 100 
            : 0;
          if (porcentaje >= 100) return 'danger';
          if (porcentaje >= presupuesto.alertaEn) return 'warning';
          if (porcentaje >= 50) return 'neutral';
          return 'ok';
        })()
      };
    });

    setPresupuestos(presupuestosConGastoReal);

    const historialMes = hist.filter(h => h.mes === mesActual && h.anio === anioActual);
    
    const totalIngresos = historialMes
      .filter(h => h.tipo === 'ingreso')
      .reduce((sum, h) => sum + h.monto, 0);
    
    const totalEgresos = historialMes
      .filter(h => h.tipo === 'egreso')
      .reduce((sum, h) => sum + h.monto, 0);

    const balance = totalIngresos - totalEgresos;
    const ahorro = balance > 0 ? (balance / totalIngresos) * 100 : 0;

    setStats({
      totalIngresos,
      totalEgresos,
      balance,
      ahorro: ahorro.toFixed(1)
    });

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menú items para el Sidebar de Usuario
  const userMenuItems = [
    { label: 'Dashboard', path: '/user/dashboard' },
    { label: 'Administrador ingresos/egresos', path: '/user/administrar-registros' },
    { label: 'Plan de Ahorros', path: '/user/plan-ahorro' },
    { label: 'Ajuste de presupuestos', path: '/user/presupuestos' },
    { label: 'Planificador de deudas', path: '/user/planificador-deudas' },
    { label: 'Logros y Recompensas', path: '/user/logros' },
  ];

  // Menú dropdown del usuario
  const userDropdownItems = [
    { icon: '👤', label: 'Mi Cuenta', path: '/user/config/cuenta' },
    { icon: '💼', label: 'Perfiles', path: '/user/config/perfiles' },
    { icon: '🔔', label: 'Notificaciones', path: '/user/config/notificaciones' },
    { icon: '🔒', label: 'Seguridad', path: '/user/config/seguridad' },
    { icon: '❓', label: 'Ayuda', path: '/user/config/ayuda' },
  ];

  // Datos para la gráfica del mes actual
  const chartDataMonthly = [
    { label: 'Ingresos', value: stats.totalIngresos, color: '#10b981' },
    { label: 'Egresos', value: stats.totalEgresos, color: '#ef4444' },
    { label: 'Balance', value: stats.balance, color: stats.balance >= 0 ? '#14b8a6' : '#f59e0b' }
  ];

  // Datos para la gráfica de balance mensual (últimos 6 meses incluyendo el actual)
  // useMemo para recalcular cuando cambie el historial o el perfil
  const chartDataBalance = useMemo(() => {
    const now = new Date();
    const mesActual = now.getMonth() + 1; // 1-12
    const anioActual = now.getFullYear();
    
    // Generar array de los últimos 6 meses
    const ultimos6Meses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(anioActual, mesActual - 1 - i, 1);
      // Obtener el último día del mes
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      
      ultimos6Meses.push({
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
        // Solo mostrar el nombre del mes (ej: "Jun", "Jul", "Ago")
        label: ultimoDia.toLocaleDateString('es', { month: 'short' }).replace('.', '')
      });
    }
    
    // Calcular balance para cada mes
    const balancesPorMes = ultimos6Meses.map(periodo => {
      const registrosMes = historial.filter(h => 
        h.mes === periodo.mes && h.anio === periodo.anio
      );
      
      const ingresos = registrosMes
        .filter(h => h.tipo === 'ingreso')
        .reduce((sum, h) => sum + h.monto, 0);
      
      const egresos = registrosMes
        .filter(h => h.tipo === 'egreso')
        .reduce((sum, h) => sum + h.monto, 0);
      
      const balance = ingresos - egresos;
      
      return {
        label: periodo.label,
        value: balance,
        color: balance >= 0 ? '#14b8a6' : '#f59e0b',
        ingresos,
        egresos
      };
    });
    
    return balancesPorMes;
  }, [historial, currentPerfil?.id]); // Recalcular cuando cambie el historial o el perfil

  // Logros desbloqueados
  const logrosDesbloqueados = logros.filter(l => l.desbloqueado).length;

  // Items del FAB (Floating Action Button)
  const fabMenuItems = [
    { icon: '💰', label: 'Nuevo Ingreso', path: '/user/nuevo-ingreso' },
    { icon: '💸', label: 'Nuevo Egreso', path: '/user/nuevo-egreso' },
    { icon: '📋', label: 'Historial', path: '/user/historial' }
  ];

  // Mostrar loading mientras carga auth o datos
  if (authLoading || loading) {
    return (
      <div className={styles.dashboardPage}>
        <Sidebar 
          menuItems={userMenuItems} 
          userMenuItems={userDropdownItems} 
          variant="user"
          onCollapsedChange={setSidebarCollapsed}
        />
        <div className={`${styles.loadingContainer} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <Sidebar 
        menuItems={userMenuItems} 
        userMenuItems={userDropdownItems} 
        variant="user"
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className={`${styles.dashboardContainer} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <div className={styles.welcomeSection}>
            <h1>¡Hola, {currentUser.nombre}! 👋</h1>
            <p>Perfil: <strong>{currentPerfil.nombre}</strong> ({currentPerfil.moneda})</p>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCards 
          stats={stats}
          simboloMoneda={currentPerfil.simboloMoneda}
          logrosDesbloqueados={logrosDesbloqueados}
          totalLogros={logros.length}
        />

        {/* Gráficas - Responsive Layout */}
        <ChartsSection 
          chartDataMonthly={chartDataMonthly}
          chartDataBalance={chartDataBalance}
        />

        {/* Main Content Grid - Presupuestos y Transacciones */}
        <div className={styles.mainGrid}>
          {/* Presupuestos */}
          <div className={styles.leftColumn}>
            <PresupuestosSection 
              presupuestos={presupuestos}
              simboloMoneda={currentPerfil.simboloMoneda}
            />
          </div>

          {/* Transacciones Recientes */}
          <div className={styles.rightColumn}>
            <TransaccionesRecientes 
              historial={historial}
              simboloMoneda={currentPerfil.simboloMoneda}
              maxItems={8}
            />
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton 
          menuItems={fabMenuItems}
          position="bottom-right"
          color="primary"
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={5000}
          />
        )}
      </div>
    </div>
  );
}

export default DashboardUser;
