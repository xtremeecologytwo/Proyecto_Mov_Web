import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui';
import styles from './ProfileModal.module.css';

/**
 * ProfileModal - Modal para crear/editar perfiles
 * @param {boolean} show - Si el modal está visible
 * @param {Object} perfil - Perfil a editar (null para crear nuevo)
 * @param {function} onClose - Callback al cerrar el modal
 * @param {function} onSubmit - Callback al enviar el formulario
 */
const ProfileModal = ({ show, perfil, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    moneda: 'USD'
  });

  // Actualizar formData cuando cambia el perfil
  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre || '',
        moneda: perfil.moneda || 'USD'
      });
    } else {
      setFormData({
        nombre: '',
        moneda: 'USD'
      });
    }
  }, [perfil, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{perfil ? 'Editar Perfil' : 'Nuevo Perfil'}</h2>
          <button 
            className={styles.modalClose} 
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">
              Nombre del perfil: <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Finanzas Personales"
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="moneda">Moneda:</label>
            <select
              id="moneda"
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
            >
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="COP">COP - Peso Colombiano</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {perfil ? 'Guardar Cambios' : 'Crear Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  show: PropTypes.bool.isRequired,
  perfil: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    moneda: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

ProfileModal.defaultProps = {
  perfil: null
};

export default ProfileModal;
