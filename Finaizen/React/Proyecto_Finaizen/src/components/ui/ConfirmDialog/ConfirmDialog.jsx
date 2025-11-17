import PropTypes from 'prop-types';
import Button from '../Button';
import styles from './ConfirmDialog.module.css';

/**
 * Componente de diálogo de confirmación reutilizable
 * @param {boolean} isOpen - Controla si el diálogo está visible
 * @param {string} title - Título del diálogo
 * @param {string} message - Mensaje de confirmación
 * @param {function} onConfirm - Callback cuando se confirma la acción
 * @param {function} onCancel - Callback cuando se cancela
 * @param {string} confirmText - Texto del botón de confirmación (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} confirmVariant - Variante del botón de confirmación (default: "danger")
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar acción',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger'
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['primary', 'danger', 'outline'])
};
