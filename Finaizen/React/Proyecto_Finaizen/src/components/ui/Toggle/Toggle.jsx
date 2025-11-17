import PropTypes from 'prop-types';
import styles from './Toggle.module.css';

/**
 * Componente Toggle/Switch reutilizable
 * Switch controlado para activar/desactivar opciones
 */
function Toggle({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  description = '',
  className = '',
  ...props
}) {
  return (
    <div className={`${styles.toggleContainer} ${className}`}>
      <div className={styles.toggleInfo}>
        {label && <label htmlFor={name} className={styles.toggleLabel}>{label}</label>}
        {description && <p className={styles.toggleDescription}>{description}</p>}
      </div>
      <label className={`${styles.toggleSwitch} ${disabled ? styles.disabled : ''}`}>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.toggleInput}
          {...props}
        />
        <span className={styles.toggleSlider}></span>
      </label>
    </div>
  );
}

// Validación de props
Toggle.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default Toggle;
