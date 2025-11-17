import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PieChart.module.css';

/**
 * PieChart - Gráfico de pastel para mostrar balance de últimos 6 meses
 * @param {Array} data - Array de objetos con { label, value, color, ingresos, egresos }
 */
function PieChart({ data = [] }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <p>No hay datos para mostrar</p>
        <span>Registra ingresos y egresos para ver el balance</span>
      </div>
    );
  }

  // Calcular total absoluto para porcentajes (solo valores positivos para proporciones)
  const absoluteValues = data.map(item => Math.abs(item.value));
  const total = absoluteValues.reduce((sum, val) => sum + val, 0);

  // Si todos son 0, mostrar empty state
  if (total === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <p>Sin movimientos en los últimos 6 meses</p>
        <span>Comienza a registrar tus ingresos y egresos</span>
      </div>
    );
  }

  // Calcular ángulos para cada segmento
  let currentAngle = -90; // Comenzar desde arriba (12 en punto)
  const segments = data.map((item, index) => {
    const percentage = (Math.abs(item.value) / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      index
    };
  });

  // Función para crear path del segmento
  const createArc = (startAngle, endAngle, radius = 40) => {
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', 50, 50,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className={styles.pieContainer}>
      <h3 className={styles.title}>Mes Actual</h3>
      
      <div className={styles.chartWrapper}>
        {/* Gráfico SVG */}
        <svg className={styles.pieSvg} viewBox="0 0 100 100">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArc(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              className={`${styles.segment} ${hoveredSegment === index ? styles.active : ''}`}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          ))}
          
          {/* Círculo blanco en el centro para efecto "pie" */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="white"
          />
        </svg>

        {/* Tooltip flotante */}
        {hoveredSegment !== null && (
          <div className={styles.floatingTooltip}>
            <div className={styles.tooltipTitle}>{segments[hoveredSegment].label}</div>
            <div className={styles.tooltipAmount}>
              ${segments[hoveredSegment].value.toLocaleString('es-EC')}
            </div>
            <div className={styles.tooltipPercent}>
              {segments[hoveredSegment].percentage.toFixed(1)}% del total
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className={styles.legend}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${styles.legendItem} ${hoveredSegment === index ? styles.highlighted : ''}`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className={styles.legendColor}
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className={styles.legendInfo}>
              <span className={styles.legendLabel}>{segment.label}</span>
              <span className={styles.legendValue}>
                ${Math.abs(segment.value).toLocaleString('es-EC')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
      ingresos: PropTypes.number,
      egresos: PropTypes.number
    })
  )
};

export default PieChart;
