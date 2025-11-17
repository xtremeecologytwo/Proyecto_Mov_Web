import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SecurityKPIs from '../../../components/security/SecurityKPIs';
import SecurityFilters from '../../../components/security/SecurityFilters';
import SecurityTable from '../../../components/security/SecurityTable';
import ConfirmModal from '../../../components/security/ConfirmModal';
import { securityLogs as initialLogs, kpiData } from '../../../utils/securityData';
import styles from './RegistroSeguridad.module.css';

const RegistroSeguridad = () => {
  const { currentUser, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logs, setLogs] = useState(initialLogs);
  const [eventFilter, setEventFilter] = useState('todos');
  const [searchValue, setSearchValue] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    logId: null,
    user: '',
    action: ''
  });

  // Configuración del menú
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
    { label: 'Mi Perfil', path: '/user/config/cuenta', icon: '👤' },
    { label: 'Configuración', path: '/user/config/seguridad', icon: '⚙️' }
  ];

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesFilter = eventFilter === 'todos' || log.type === eventFilter;
    const matchesSearch = 
      log.user.toLowerCase().includes(searchValue.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchValue.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleActionClick = (logId, user, action) => {
    setModalState({
      isOpen: true,
      logId,
      user,
      action
    });
  };

  const handleConfirm = () => {
    setLogs(prevLogs => 
      prevLogs.map(log => 
        log.id === modalState.logId 
          ? { ...log, blocked: !log.blocked }
          : log
      )
    );
    console.log(`Usuario ${modalState.action === 'bloquear' ? 'bloqueado' : 'desbloqueado'}.`);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      logId: null,
      user: '',
      action: ''
    });
  };

  const modalTitle = `Confirmar ${modalState.action.charAt(0).toUpperCase() + modalState.action.slice(1)}`;
  const modalMessage = `¿Estás seguro de que quieres <strong>${modalState.action}</strong> al usuario <strong>${modalState.user}</strong>?`;

  return (
    <div className={styles.container}>
      <Sidebar
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />
      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <SecurityKPIs data={kpiData} />
        
        <section className={styles.card}>
          <SecurityFilters
            eventFilter={eventFilter}
            searchValue={searchValue}
            onEventFilterChange={setEventFilter}
            onSearchChange={setSearchValue}
          />
          <SecurityTable 
            logs={filteredLogs}
            onActionClick={handleActionClick}
          />
        </section>
      </main>

      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalTitle}
        message={modalMessage}
        action={modalState.action}
        onConfirm={handleConfirm}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default RegistroSeguridad;
