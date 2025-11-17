import styles from './ViewModal.module.css';

const ViewModal = ({ isOpen, ticket, onClose }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Detalle del Reporte de Soporte</h3>
        <div className={styles.reportDetails}>
          <p><strong>Reporte ID:</strong> {ticket.id}</p>
          <p><strong>Usuario:</strong> {ticket.user}</p>
          <p><strong>Asunto:</strong> {ticket.subject}</p>
          <p><strong>Fecha de Creación:</strong> {ticket.date}</p>
          <p>
            <strong>Estado:</strong>{' '}
            <span className={`${styles.status} ${styles[ticket.status]}`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </p>
          <p><strong>Detalle:</strong> No hay un campo de detalle en los datos de ejemplo, pero aquí se mostraría.</p>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.btnClose} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
