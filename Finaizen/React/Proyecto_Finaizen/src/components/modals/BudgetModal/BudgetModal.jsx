import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import styles from './BudgetModal.module.css';

/**
 * Modal para crear/editar presupuestos
 */
export default function BudgetModal({ isOpen, presupuesto, onSave, onCancel, simboloMoneda }) {
  const [formData, setFormData] = useState({
    categoria: '',
    montoLimite: '',
    alertaEn: 80,
    periodo: 'mensual'
  });

  const [errors, setErrors] = useState({});

  const isEditMode = presupuesto !== null;

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && presupuesto) {
      setFormData({
        categoria: presupuesto.categoria || '',
        montoLimite: presupuesto.montoLimite?.toString() || '',
        alertaEn: presupuesto.alertaEn || 80,
        periodo: presupuesto.periodo || 'mensual'
      });
      setErrors({});
    } else if (isOpen && !presupuesto) {
      setFormData({
        categoria: '',
        montoLimite: '',
        alertaEn: 80,
        periodo: 'mensual'
      });
      setErrors({});
    }
  }, [isOpen, presupuesto]);

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

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.montoLimite || parseFloat(formData.montoLimite) <= 0) {
      newErrors.montoLimite = 'El monto límite debe ser mayor a 0';
    }

    if (formData.alertaEn < 0 || formData.alertaEn > 100) {
      newErrors.alertaEn = 'El porcentaje de alerta debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const budgetData = {
      categoria: formData.categoria.trim(),
      montoLimite: parseFloat(formData.montoLimite),
      alertaEn: parseInt(formData.alertaEn),
      periodo: formData.periodo
    };

    if (isEditMode) {
      onSave({ ...presupuesto, ...budgetData });
    } else {
      onSave(budgetData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditMode ? '✏️ Editar Presupuesto' : '➕ Agregar Presupuesto'}</h2>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Categoría */}
          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoría:</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: Comida, Transporte, Ocio..."
              className={errors.categoria ? styles.inputError : ''}
              disabled={isEditMode}
            />
            {errors.categoria && <span className={styles.errorText}>{errors.categoria}</span>}
            {isEditMode && (
              <span className={styles.helperText}>No se puede cambiar la categoría en modo edición</span>
            )}
          </div>

          {/* Monto Límite */}
          <div className={styles.formGroup}>
            <label htmlFor="montoLimite">Monto Límite ({simboloMoneda}):</label>
            <input
              type="number"
              id="montoLimite"
              name="montoLimite"
              value={formData.montoLimite}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.montoLimite ? styles.inputError : ''}
            />
            {errors.montoLimite && <span className={styles.errorText}>{errors.montoLimite}</span>}
          </div>

          {/* Alerta en (%) */}
          <div className={styles.formGroup}>
            <label htmlFor="alertaEn">Alertar al llegar al (%):</label>
            <input
              type="number"
              id="alertaEn"
              name="alertaEn"
              value={formData.alertaEn}
              onChange={handleChange}
              min="0"
              max="100"
              className={errors.alertaEn ? styles.inputError : ''}
            />
            {errors.alertaEn && <span className={styles.errorText}>{errors.alertaEn}</span>}
            <span className={styles.helperText}>
              Recibirás una advertencia al gastar el {formData.alertaEn}% del presupuesto
            </span>
          </div>

          {/* Periodo */}
          <div className={styles.formGroup}>
            <label htmlFor="periodo">Periodo:</label>
            <select
              id="periodo"
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
            >
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
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
              {isEditMode ? 'Guardar Cambios' : 'Crear Presupuesto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

BudgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  presupuesto: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  simboloMoneda: PropTypes.string.isRequired
};
