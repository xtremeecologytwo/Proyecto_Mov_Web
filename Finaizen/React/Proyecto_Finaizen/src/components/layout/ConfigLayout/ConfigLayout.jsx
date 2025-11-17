import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import styles from './ConfigLayout.module.css';

/**
 * ConfigLayout - Layout para páginas de configuración
 * Usa el Sidebar reutilizable con variante 'config'
 */
const ConfigLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Menú de configuración
  const configMenuItems = [
    { label: '← Volver al Dashboard', path: '/user/dashboard', icon: '🏠' },
    { label: 'Cuenta', path: '/user/config/cuenta', icon: '👤' },
    { label: 'Perfiles', path: '/user/config/perfiles', icon: '💼' },
    { label: 'Seguridad', path: '/user/config/seguridad', icon: '🔒' },
    { label: 'Notificaciones', path: '/user/config/notificaciones', icon: '🔔' },
    { label: 'Ayuda y Reportes', path: '/user/config/ayuda', icon: '❓' }
  ];

  // Opciones del menú de usuario
  const userMenuItems = [
    { label: 'Dashboard', icon: '🏠', action: () => navigate('/user/dashboard') },
    { label: 'Mi Cuenta', icon: '👤', action: () => navigate('/user/config/cuenta') }
  ];

  return (
    <div className={styles.configLayout}>
      <Sidebar 
        menuItems={configMenuItems}
        userMenuItems={userMenuItems}
        variant="config"
        onCollapsedChange={setIsCollapsed}
      />
      
      <main className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default ConfigLayout;
