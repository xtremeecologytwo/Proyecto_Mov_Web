import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import styles from './EditRecordModal.module.css';

/**
 * Modal para editar un registro de ingreso/egreso del historial
 * Solo permite editar: fecha, tipo, descripción, categoría y monto
 */
export default function EditRecordModal({ isOpen, record, onSave, onCancel, simboloMoneda }) {
  const [formData, setFormData] = useState({
    fecha: '',
    tipo: 'ingreso',
    descripcion: '',
    categoria: '',
    monto: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos del registro cuando se abre el modal
  useEffect(() => {
    if (isOpen && record) {
      setFormData({
        fecha: record.fechaEjecucion ? new Date(record.fechaEjecucion).toISOString().split('T')[0] : '',
        tipo: record.tipo || 'ingreso',
        descripcion: record.descripcion || '',
        categoria: record.categoria || '',
        monto: record.monto?.toString() || ''
      });
      setErrors({});
    }
  }, [isOpen, record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fecha.trim()) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const updatedRecord = {
      ...record,
      fechaEjecucion: new Date(formData.fecha),
      tipo: formData.tipo,
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria.trim(),
      monto: parseFloat(formData.monto)
    };

    onSave(updatedRecord);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>✏️ Editar Registro</h2>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Fecha */}
          <div className={styles.formGroup}>
            <label htmlFor="fecha">Fecha de ejecución:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={errors.fecha ? styles.inputError : ''}
            />
            {errors.fecha && <span className={styles.errorText}>{errors.fecha}</span>}
          </div>

          {/* Tipo */}
          <div className={styles.formGroup}>
            <label htmlFor="tipo">Tipo:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="ingreso">💰 Ingreso</option>
              <option value="egreso">💸 Egreso</option>
            </select>
          </div>

          {/* Descripción */}
          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción:</label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ej: Salario mensual"
              className={errors.descripcion ? styles.inputError : ''}
            />
            {errors.descripcion && <span className={styles.errorText}>{errors.descripcion}</span>}
          </div>

          {/* Categoría */}
          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoría:</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: Trabajo"
              className={errors.categoria ? styles.inputError : ''}
            />
            {errors.categoria && <span className={styles.errorText}>{errors.categoria}</span>}
          </div>

          {/* Monto */}
          <div className={styles.formGroup}>
            <label htmlFor="monto">Monto ({simboloMoneda}):</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.monto ? styles.inputError : ''}
            />
            {errors.monto && <span className={styles.errorText}>{errors.monto}</span>}
          </div>

          {/* Botones */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  record: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  simboloMoneda: PropTypes.string.isRequired
};
