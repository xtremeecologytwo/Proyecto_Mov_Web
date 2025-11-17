import PropTypes from 'prop-types';
import styles from './Textarea.module.css';

/**
 * Componente Textarea reutilizable
 * Textarea controlado con label, error y contador de caracteres opcional
 */
function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  rows = 4,
  maxLength,
  showCounter = false,
  className = '',
  ...props
}) {
  const characterCount = value ? value.length : 0;

  return (
    <div className={`${styles.textareaGroup} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.textareaLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`${styles.textareaField} ${error ? styles.textareaError : ''}`}
        {...props}
      />
      <div className={styles.textareaFooter}>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {showCounter && maxLength && (
          <span className={styles.characterCounter}>
            {characterCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

// Validación de props
Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCounter: PropTypes.bool,
  className: PropTypes.string,
};

export default Textarea;
