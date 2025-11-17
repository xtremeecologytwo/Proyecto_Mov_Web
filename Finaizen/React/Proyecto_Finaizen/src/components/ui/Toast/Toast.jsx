import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Toast.module.css';

/**
 * Toast - Componente de notificación temporal
 * Muestra mensajes de éxito, error, advertencia o información
 * 
 * @param {string} type - Tipo de notificación: 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Mensaje a mostrar
 * @param {function} onClose - Función callback al cerrar
 * @param {number} duration - Duración en ms antes de auto-cerrar (0 = no auto-cerrar)
 */
function Toast({ type = 'info', message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button 
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default Toast;
