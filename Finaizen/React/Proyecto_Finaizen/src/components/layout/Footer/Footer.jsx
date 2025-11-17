import PropTypes from 'prop-types';
import styles from './Footer.module.css';

/**
 * Componente Footer - Pie de página
 * Simple para páginas de autenticación, completo para landing
 */
function Footer({ simple = false }) {
  if (simple) {
    return (
      <footer className={styles.footerSimple}>
        <div className={styles.footerSimpleContainer}>
          <p>&copy; 2024 Finaizen. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footerFull}>
      <div className={styles.footerGrid}>
        {/* Información de Contacto */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contacto</h3>
          <p>📧 Email: soporte@finaizen.com</p>
          <p>📞 Teléfono: +593 99 123 4567</p>
          <p>📍 Dirección: Quito, Ecuador</p>
        </div>

        {/* Redes Sociales */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Redes Sociales</h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>Facebook</a>
            <a href="#" className={styles.socialLink}>Instagram</a>
            <a href="#" className={styles.socialLink}>Twitter</a>
            <a href="#" className={styles.socialLink}>LinkedIn</a>
          </div>
        </div>

        {/* Asistencia Técnica */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Asistencia Técnica</h3>
          <p>¿Necesitas ayuda inmediata?</p>
          <button className={`${styles.btn} ${styles.btnSupport}`}>Abrir Chat de Soporte</button>
          <p className={styles.copyright}>© 2024 Finaizen. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  simple: PropTypes.bool,
};

export default Footer;
