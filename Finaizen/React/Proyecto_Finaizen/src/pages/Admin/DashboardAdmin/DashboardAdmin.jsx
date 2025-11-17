import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import AdminSummaryCards from '../../../components/dashboard/AdminSummaryCards';
import UserGrowthChart from '../../../components/dashboard/UserGrowthChart';
import mockDB from '../../../utils/mockDatabase';
import styles from './DashboardAdmin.module.css';

/**
 * DashboardAdmin - Dashboard principal para administradores
 * Muestra estadísticas generales y gráficos de usuarios
 */
function DashboardAdmin() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usuariosActivos: 0,
    cuentasCreadas: 0,
    reportes: 0
  });
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Proteger la ruta - solo admins
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = () => {
      // Obtener todos los usuarios
      const allUsers = mockDB.users || [];
      
      // Calcular estadísticas
      const usuariosActivos = allUsers.filter(u => u.activo !== false).length;
      const cuentasCreadas = allUsers.length;
      
      // Obtener reportes (puedes ajustar esto según tu modelo de datos)
      const reportes = mockDB.securityLogs?.filter(log => 
        log.eventCategory === 'SOPORTE' || log.eventType.includes('REPORT')
      ).length || 12;

      setStats({
        usuariosActivos,
        cuentasCreadas,
        reportes
      });

      // Generar datos de crecimiento (esto es un ejemplo, ajusta según tu lógica)
      const growthData = [
        { mes: 'Ene', usuarios: 125 },
        { mes: 'Feb', usuarios: 150 },
        { mes: 'Mar', usuarios: 210 },
        { mes: 'Abr', usuarios: 250 },
        { mes: 'May', usuarios: 325 },
        { mes: 'Jun', usuarios: 400 }
      ];
      setUserGrowthData(growthData);
    };

    if (currentUser && isAdmin) {
      loadStats();
    }
  }, [currentUser, isAdmin]);

  // Configuración del menú del sidebar para admin
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Gestión de Usuarios', path: '/admin/gestion-usuarios' },
    { label: 'Gestión de Roles', path: '/admin/gestion-roles' },
    { label: 'Supervisión de Categorías', path: '/admin/supervision-categorias' },
    { label: 'Registro de Seguridad', path: '/admin/registro-seguridad' },
    { label: 'Inteligencia de Mercado', path: '/admin/inteligencia-mercado' },
    { label: 'Reportes y Soporte', path: '/admin/reportes-soporte' }
  ];

  const userMenuItems = [
    { label: 'Mi Perfil', path: '/config/perfil', icon: '👤' },
    { label: 'Configuración', path: '/config/cuenta', icon: '⚙️' }
  ];

  if (!currentUser || !isAdmin) {
    return null; // No mostrar nada mientras redirige
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.dashboardAdmin} ${isCollapsed ? styles.expanded : ''}`}>
        <AdminSummaryCards stats={stats} />
        <UserGrowthChart data={userGrowthData} title="Crecimiento de Usuarios" />
      </main>
    </div>
  );
}

export default DashboardAdmin;
