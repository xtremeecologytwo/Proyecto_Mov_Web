import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, title, message, action, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const confirmButtonStyle = action === 'bloquear' 
    ? { backgroundColor: '#dc3545' } 
    : { backgroundColor: '#28a745' };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p dangerouslySetInnerHTML={{ __html: message }} />
        <div className={styles.modalActions}>
          <button 
            className={styles.btnCancel}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.btnConfirm}
            style={confirmButtonStyle}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
