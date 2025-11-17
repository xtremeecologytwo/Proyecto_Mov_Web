import styles from './KPICards.module.css';

/**
 * KPICards - Tarjetas de indicadores clave
 */
function KPICards({ total, active, suspended }) {
  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiCard}>
        <h4>Total de Usuarios</h4>
        <p>{total}</p>
      </div>
      <div className={styles.kpiCard}>
        <h4>Usuarios Activos</h4>
        <p>{active}</p>
      </div>
      <div className={styles.kpiCard}>
        <h4>Usuarios Suspendidos</h4>
        <p>{suspended}</p>
      </div>
    </div>
  );
}

export default KPICards;
