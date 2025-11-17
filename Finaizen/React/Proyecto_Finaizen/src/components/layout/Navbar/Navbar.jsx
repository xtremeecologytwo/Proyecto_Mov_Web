import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import styles from './Navbar.module.css';

/**
 * Componente Navbar - Barra de navegación principal
 * Para páginas públicas (Landing, Login, Register)
 */
function Navbar() {
  return (
    <header className={styles.navbarHeader}>
      <nav className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          Finaizen
        </Link>
        <div className={styles.navbarActions}>
          <Link to="/login" className={styles.navbarLink}>
            Iniciar sesión
          </Link>
          <Link to="/register">
            <Button variant="brand">Registrarse</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
