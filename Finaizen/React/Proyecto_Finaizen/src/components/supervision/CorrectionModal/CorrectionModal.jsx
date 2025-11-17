import { useState, useEffect } from 'react';
import styles from './CorrectionModal.module.css';

function CorrectionModal({ isOpen, onClose, transaction, categories, onSave }) {
  const [formData, setFormData] = useState({
    keyword: '',
    category: '',
    createRule: false
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        keyword: transaction.keyword || '',
        category: transaction.category || '',
        createRule: false
      });
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transaction.id, formData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Corregir Categorización IA</h3>
        <p className={styles.transactionDesc}>
          <strong>Descripción:</strong> "{transaction.desc}"
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Palabra Clave:</label>
            <input
              type="text"
              value={formData.keyword}
              onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Categoría:</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.createRule}
                onChange={(e) => setFormData({ ...formData, createRule: e.target.checked })}
              />
              Crear regla automática para esta palabra clave
            </label>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Guardar Corrección
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CorrectionModal;
