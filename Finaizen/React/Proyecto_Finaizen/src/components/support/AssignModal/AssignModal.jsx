import styles from './AssignModal.module.css';

const AssignModal = ({ isOpen, ticket, assignOptions, onSave, onCancel }) => {
  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignTo = e.target.assignTo.value;
    onSave(ticket.id, assignTo);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Asignar Reporte de Soporte</h3>
        <p><strong>Reporte ID:</strong> {ticket.id}</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="assignTo">Asignar a:</label>
            <select id="assignTo" name="assignTo" defaultValue={assignOptions[0]}>
              {assignOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
