import styles from './SimpleDoughnutChart.module.css';

const SimpleDoughnutChart = ({ data, colors, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentOffset = 0;
  const stops = data.map((item, index) => {
    const start = currentOffset;
    const percentage = total === 0 ? 0 : (item.value / total) * 100;
    currentOffset += percentage;

    return `${colors[index % colors.length]} ${start}% ${currentOffset}%`;
  });

  const gradient =
    stops.length > 0
      ? `conic-gradient(${stops.join(', ')})`
      : 'radial-gradient(circle, #ffffff 60%, #e9ecef 60%)';

  return (
    <div className={styles.wrapper}>
      <div className={styles.chart} style={{ background: gradient }} role="img" aria-label={title}>
        <div className={styles.innerCircle} />
      </div>
      <dl className={styles.legend}>
        {data.map((item, index) => (
          <div key={item.label} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: colors[index % colors.length] }}
              aria-hidden="true"
            />
            <dt className={styles.legendLabel}>{item.label}</dt>
            <dd className={styles.legendValue}>
              {total === 0 ? '0%' : `${Math.round((item.value / total) * 100)}%`}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default SimpleDoughnutChart;
