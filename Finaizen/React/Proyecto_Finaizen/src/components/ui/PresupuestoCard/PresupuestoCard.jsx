import PropTypes from 'prop-types';
import styles from './PresupuestoCard.module.css';

/**
 * Componente de tarjeta de presupuesto
 * Muestra el progreso de gasto de una categoría
 */
export default function PresupuestoCard({ 
  presupuesto, 
  simboloMoneda = '$',
  onEdit,
  onDelete,
  showActions = true,
  compact = false
}) {
  const { categoria, montoGastado, montoLimite, porcentajeGastado, estado } = presupuesto;

  const getAlertMessage = () => {
    switch (estado) {
      case 'danger':
        return '¡Tomar medidas! Has excedido el presupuesto.';
      case 'warning':
        return '¡Cuidado! Estás llegando al límite.';
      case 'neutral':
        return 'Moderado. Mantén el control.';
      case 'ok':
        return 'Bajo control.';
      default:
        return '';
    }
  };

  // Renderizado para modo compacto (Dashboard)
  if (compact) {
    return (
      <div className={`${styles.budgetCard} ${styles[`status${estado.charAt(0).toUpperCase() + estado.slice(1)}`]} ${styles.compact}`}>
        <div className={styles.budgetHeader}>
          <h3 className={styles.category}>{categoria}</h3>
          <div className={styles.details}>
            <span className={styles.amount}>
              {simboloMoneda}{montoGastado.toFixed(2)} / {simboloMoneda}{montoLimite.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progress}
            style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
          />
        </div>
        
        <span className={styles.percentage}>
          {porcentajeGastado.toFixed(0)}% usado
        </span>
      </div>
    );
  }

  // Renderizado para modo completo (Página Presupuestos)
  return (
    <div className={`${styles.budgetCard} ${styles[`status${estado.charAt(0).toUpperCase() + estado.slice(1)}`]}`}>
      {/* Fila 1: Categoría */}
      <h3 className={styles.category}>{categoria}</h3>
      
      {/* Fila 1: Monto */}
      <span className={styles.amount}>
        {simboloMoneda}{montoGastado.toFixed(2)} / {simboloMoneda}{montoLimite.toFixed(2)}
      </span>
      
      {/* Fila 1: Acciones (en mobile van después de todo) */}
      {showActions && (
        <div className={styles.budgetActions}>
          <button
            onClick={() => onEdit && onEdit(presupuesto)}
            className={styles.editButton}
            title="Editar presupuesto"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete && onDelete(presupuesto)}
            className={styles.deleteButton}
            title="Eliminar presupuesto"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
      
      {/* Fila 2: Barra de progreso */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progress}
          style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
        />
      </div>
      
      {/* Fila 3: Mensaje de estado */}
      <span className={styles.alertText}>
        💡 {getAlertMessage()}
      </span>
    </div>
  );
}

PresupuestoCard.propTypes = {
  presupuesto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    categoria: PropTypes.string.isRequired,
    montoGastado: PropTypes.number.isRequired,
    montoLimite: PropTypes.number.isRequired,
    porcentajeGastado: PropTypes.number.isRequired,
    estado: PropTypes.oneOf(['ok', 'neutral', 'warning', 'danger']).isRequired
  }).isRequired,
  simboloMoneda: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
  compact: PropTypes.bool
};
