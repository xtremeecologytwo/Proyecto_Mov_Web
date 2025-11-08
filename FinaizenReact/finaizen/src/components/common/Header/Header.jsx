import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.branding}>
      <span className={styles.logo}>FZ</span>
      <span className={styles.title}>Finaizen</span>
    </div>
    <nav className={styles.nav} aria-label="Main navigation">
      <a className={styles.navLink} href="#features">
        Características
      </a>
      <a className={styles.navLink} href="#pricing">
        Precios
      </a>
      <a className={styles.navLink} href="#contact">
        Contacto
      </a>
    </nav>
  </header>
);

export default Header;
