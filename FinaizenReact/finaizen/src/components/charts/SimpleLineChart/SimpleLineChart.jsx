import styles from './SimpleLineChart.module.css';

const VIEW_HEIGHT = 100;
const STEP = 100;

const buildPoints = (values, minValue, maxValue) => {
  if (values.length === 0) {
    return '';
  }

  const range = maxValue - minValue || 1;

  return values
    .map((value, index) => {
      const x = index * STEP;
      const normalized = (value - minValue) / range;
      const y = VIEW_HEIGHT - normalized * VIEW_HEIGHT;

      return `${x},${y}`;
    })
    .join(' ');
};

const SimpleLineChart = ({ labels, series, title }) => {
  const allValues = series.flatMap((item) => item.values);
  const valuesToMeasure = allValues.length > 0 ? allValues : [0];
  const minValue = Math.min(...valuesToMeasure);
  const maxValue = Math.max(...valuesToMeasure);
  const viewWidth = (labels.length - 1 || 1) * STEP;

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={title}
        preserveAspectRatio="none"
      >
        <rect className={styles.background} x="0" y="0" width={viewWidth} height={VIEW_HEIGHT} />
        {series.map((item) => (
          <polyline
            key={item.label}
            className={styles.line}
            points={buildPoints(item.values, minValue, maxValue)}
            stroke={item.color}
            fill="none"
          />
        ))}
      </svg>

      <div className={styles.legend} aria-hidden="true">
        {series.map((item) => (
          <span key={item.label} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <ul className={styles.labels} aria-hidden="true">
        {labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
};

export default SimpleLineChart;
