import PropTypes from 'prop-types';
import { Card } from '../../ui';
import styles from './StatsCards.module.css';

/**
 * StatsCards - Muestra las tarjetas de estadísticas del dashboard
 * @param {Object} stats - Estadísticas calculadas
 * @param {string} simboloMoneda - Símbolo de la moneda actual
 * @param {number} logrosDesbloqueados - Número de logros desbloqueados
 * @param {number} totalLogros - Total de logros disponibles
 */
function StatsCards({ stats, simboloMoneda, logrosDesbloqueados, totalLogros }) {
  return (
    <div className={styles.statsGrid}>
      <Card variant="success" icon="💰" title="Ingresos del Mes">
        <div className={styles.statValue}>
          {simboloMoneda}{stats.totalIngresos.toLocaleString()}
        </div>
      </Card>

      <Card variant="danger" icon="💸" title="Egresos del Mes">
        <div className={styles.statValue}>
          {simboloMoneda}{stats.totalEgresos.toLocaleString()}
        </div>
      </Card>

      <Card variant={stats.balance >= 0 ? 'primary' : 'warning'} icon="📊" title="Balance">
        <div className={styles.statValue}>
          {simboloMoneda}{stats.balance.toLocaleString()}
        </div>
      </Card>

      <Card variant="default" icon="🎯" title="Logros Desbloqueados">
        <div className={styles.statValue}>
          {logrosDesbloqueados}/{totalLogros}
        </div>
      </Card>
    </div>
  );
}

StatsCards.propTypes = {
  stats: PropTypes.shape({
    totalIngresos: PropTypes.number.isRequired,
    totalEgresos: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    ahorro: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }).isRequired,
  simboloMoneda: PropTypes.string.isRequired,
  logrosDesbloqueados: PropTypes.number.isRequired,
  totalLogros: PropTypes.number.isRequired
};

export default StatsCards;
