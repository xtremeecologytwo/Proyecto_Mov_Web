import styles from './DeleteRoleModal.module.css';

/**
 * DeleteRoleModal - Modal de confirmación para eliminar rol
 */
function DeleteRoleModal({ isOpen, onClose, onConfirm, roleName }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Confirmar Eliminación</h3>
        <p>
          ¿Estás seguro de que quieres eliminar el rol <strong>{roleName}</strong>? 
          Esta acción no se puede deshacer.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoleModal;
