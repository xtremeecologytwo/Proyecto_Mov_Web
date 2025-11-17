import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Componente Button reutilizable
 * Soporta diferentes variantes según el diseño de Finaizen
 */
function Button({ 
  children, 
  variant = 'brand', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) {
  const buttonClass = `${styles.btn} ${styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Validación de props con PropTypes
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['brand', 'outline', 'support', 'filter', 'add', 'primary', 'danger']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
