import styles from './SupervisionKPIs.module.css';

function SupervisionKPIs({ precision, corrections, problematicCategories }) {
  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiCard}>
        <h4>Precisión del modelo</h4>
        <p>{precision}%</p>
        <span>Últimos 7 días</span>
      </div>
      <div className={styles.kpiCard}>
        <h4>Correcciones manuales</h4>
        <p>{corrections}</p>
        <span>Últimos 7 días</span>
      </div>
      <div className={styles.kpiCard}>
        <h4>Categorías problemáticas</h4>
        <ul className={styles.problemList}>
          {problematicCategories.map((cat, index) => (
            <li key={index}>{index + 1}. {cat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SupervisionKPIs;
