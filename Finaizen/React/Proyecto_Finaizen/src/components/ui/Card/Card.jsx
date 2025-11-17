import styles from './Card.module.css';

/**
 * Card - Componente de tarjeta reutilizable
 * @param {string} title - Título de la tarjeta
 * @param {string} subtitle - Subtítulo opcional
 * @param {string} icon - Icono emoji opcional
 * @param {string} variant - Estilo de la tarjeta: 'default' | 'primary' | 'success' | 'warning' | 'danger'
 * @param {React.ReactNode} children - Contenido de la tarjeta
 * @param {React.ReactNode} footer - Contenido del footer opcional
 * @param {function} onClick - Callback al hacer click
 * @param {string} className - Clases CSS adicionales
 */
function Card({ 
  title, 
  subtitle, 
  icon, 
  variant = 'default', 
  children, 
  footer,
  onClick,
  className = '' 
}) {
  return (
    <div 
      className={`${styles.card} ${styles[variant]} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || icon) && (
        <div className={styles.cardHeader}>
          {icon && <span className={styles.cardIcon}>{icon}</span>}
          <div className={styles.cardHeaderText}>
            {title && <h3 className={styles.cardTitle}>{title}</h3>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      
      {children && (
        <div className={styles.cardBody}>
          {children}
        </div>
      )}

      {footer && (
        <div className={styles.cardFooter}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
