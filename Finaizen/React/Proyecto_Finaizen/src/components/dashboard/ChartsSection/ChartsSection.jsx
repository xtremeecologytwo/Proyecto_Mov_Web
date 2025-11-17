import { useState } from 'react';
import PropTypes from 'prop-types';
import { PieChart, SimpleBarChart } from '../../ui';
import styles from './ChartsSection.module.css';

/**
 * ChartsSection - Sección de gráficas del dashboard
 * @param {Array} chartDataMonthly - Datos para la gráfica mensual (PieChart)
 * @param {Array} chartDataBalance - Datos para la gráfica de balance (SimpleBarChart)
 */
function ChartsSection({ chartDataMonthly, chartDataBalance }) {
  const [chartView, setChartView] = useState('monthly'); // 'monthly' o 'last6months'

  return (
    <div className={styles.chartsSection}>
      {/* Switch Button - Solo visible en tablet/móvil */}
      <div className={styles.mobileChartToggle}>
        <button 
          className={`${styles.toggleButton} ${chartView === 'monthly' ? styles.active : ''}`}
          onClick={() => setChartView('monthly')}
        >
          📊 Mes Actual
        </button>
        <button 
          className={`${styles.toggleButton} ${chartView === 'last6months' ? styles.active : ''}`}
          onClick={() => setChartView('last6months')}
        >
          📈 Balance Mensual
        </button>
      </div>

      {/* Desktop: Dos columnas lado a lado | Tablet/Móvil: Una gráfica según toggle */}
      <div className={styles.chartsGrid}>
        {/* Gráfica de Pastel - Mes Actual (izquierda en desktop) */}
        <div className={`${styles.chartCard} ${chartView === 'monthly' ? styles.mobileVisible : styles.mobileHidden}`}>
          <PieChart data={chartDataMonthly} />
        </div>

        {/* Gráfica de Barras - Balance Mensual 6 meses (derecha en desktop) */}
        <div className={`${styles.chartCard} ${chartView === 'last6months' ? styles.mobileVisible : styles.mobileHidden}`}>
          <SimpleBarChart data={chartDataBalance} height="350px" />
        </div>
      </div>
    </div>
  );
}

ChartsSection.propTypes = {
  chartDataMonthly: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  chartDataBalance: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    ingresos: PropTypes.number,
    egresos: PropTypes.number
  })).isRequired
};

export default ChartsSection;
