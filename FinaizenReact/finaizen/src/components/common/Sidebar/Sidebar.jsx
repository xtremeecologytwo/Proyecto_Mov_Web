import { useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.css';

const NAV_LINKS = [
  { label: 'Dashboard Admin', href: '/admin/dashboard' },
  { label: 'Dashboard Usuario', href: '/user/dashboard' },
  { label: 'Inteligencia de mercado', href: '#market-intel' },
  { label: 'Supervisión de categorías (IA)', href: '#categories-ai' },
  { label: 'Reportes de Soporte', href: '#support-reports' },
  { label: 'Registro de Seguridad', href: '#security-log' },
  { label: 'Gestión de usuarios', href: '#user-management' },
  { label: 'Gestión de roles', href: '#role-management' },
];

const USER_MENU_ITEMS = [
  { label: 'Mi Perfil', href: '#profile', icon: '👤' },
  { label: 'Configuración', href: '#settings', icon: '⚙️' },
  { label: 'Notificaciones', href: '#notifications', icon: '🔔' },
  { label: 'Seguridad', href: '#security', icon: '🔒' },
  { label: 'Ayuda y Soporte', href: '#help', icon: '❓' },
  { type: 'divider' },
  { label: 'Cerrar Sesión', href: '#logout', icon: '🚪', variant: 'logout' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => {
      if (!prevState) {
        setIsUserMenuOpen(false);
      }

      return !prevState;
    });
  };

  const handleUserToggle = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = (event, item) => {
    if (item.variant === 'logout') {
      event.preventDefault();
      // TODO: replace with real logout action once authentication is available.
      console.info('Cerrar sesión');
      setIsUserMenuOpen(false);
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      aria-expanded={!isCollapsed}
    >
      <div className={styles.sidebarHeader}>
        <h2 className={styles.title}>Admin Panel</h2>
        <button
          className={styles.menuToggle}
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          aria-pressed={isCollapsed}
          aria-expanded={!isCollapsed}
        >
          ☰
        </button>
      </div>

      <nav className={styles.sidebarNav} aria-label="Navegación lateral">
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href} className={styles.navItem}>
              <a className={styles.navLink} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter} ref={dropdownRef}>
        <button
          type="button"
          className={styles.user}
          onClick={handleUserToggle}
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          aria-label={
            isUserMenuOpen ? 'Cerrar menú del usuario' : 'Abrir menú del usuario'
          }
        >
          <img
            className={styles.userAvatar}
            src="https://placehold.co/40x40/6c757d/ffffff?text=A"
            alt="Avatar de administrador"
          />
          <p className={styles.userName}>Admin</p>
        </button>

        <div
          className={`${styles.userDropdown} ${isUserMenuOpen ? styles.dropdownActive : ''}`}
          role="menu"
        >
          <div className={styles.dropdownHeader}>
            <img
              src="https://placehold.co/50x50/6c757d/ffffff?text=U"
              alt="Avatar del usuario"
            />
            <div className={styles.userInfo}>
              <p className={styles.dropdownUserName}>Kevin Perez</p>
              <p className={styles.dropdownEmail}>usuario@finaizen.com</p>
            </div>
          </div>

          <ul className={styles.dropdownMenu}>
            {USER_MENU_ITEMS.map((item) =>
              item.type === 'divider' ? (
                <li key="divider" className={styles.dropdownDivider} role="separator" />
              ) : (
                <li key={item.href} className={styles.dropdownItem}>
                  <a
                    className={`${styles.dropdownLink} ${
                      item.variant === 'logout' ? styles.logoutLink : ''
                    }`}
                    href={item.href}
                    onClick={(event) => handleMenuItemClick(event, item)}
                    role="menuitem"
                  >
                    <span className={styles.dropdownIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className={styles.dropdownText}>{item.label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
