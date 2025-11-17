import PropTypes from 'prop-types';
import styles from './BalanceTooltipModal.module.css';

/**
 * BalanceTooltipModal - Modal para mostrar desglose de balance
 * @param {Object} data - Datos del mes { label, ingresos, egresos, value }
 * @param {Object} position - Posición del modal { top, left }
 */
function BalanceTooltipModal({ data, position }) {
  if (!data) return null;

  return (
    <div 
      className={styles.tooltipModal}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className={styles.tooltipHeader}>{data.label}</div>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipLabel}>💰 Ingresos:</span>
        <span className={styles.tooltipValue}>
          ${data.ingresos?.toLocaleString('es-EC') || 0}
        </span>
      </div>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipLabel}>💸 Egresos:</span>
        <span className={styles.tooltipValue}>
          ${data.egresos?.toLocaleString('es-EC') || 0}
        </span>
      </div>
      <div className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
        <span className={styles.tooltipLabel}>📊 Balance:</span>
        <span className={`${styles.tooltipValue} ${data.value >= 0 ? styles.positive : styles.negative}`}>
          ${data.value?.toLocaleString('es-EC') || 0}
        </span>
      </div>
      <div className={styles.tooltipArrow}></div>
    </div>
  );
}

BalanceTooltipModal.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    ingresos: PropTypes.number,
    egresos: PropTypes.number,
    value: PropTypes.number
  }),
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }).isRequired
};

export default BalanceTooltipModal;
