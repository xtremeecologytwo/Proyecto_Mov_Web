import styles from './SecurityKPIs.module.css';

const SecurityKPIs = ({ data }) => {
  return (
    <div className={styles.kpiContainer}>
      <div className={`${styles.kpiCard} ${styles.security}`}>
        <h4>Intentos Fallidos</h4>
        <p>{data.failedAttempts}</p>
        <span>Últimas 24h</span>
      </div>
      <div className={`${styles.kpiCard} ${styles.security}`}>
        <h4>Cuentas Bloqueadas</h4>
        <p>{data.blockedAccounts}</p>
        <span>Total</span>
      </div>
      <div className={`${styles.kpiCard} ${styles.security}`}>
        <h4>Eventos Críticos</h4>
        <p>{data.criticalEvents}</p>
        <span>Últimas 24h</span>
      </div>
    </div>
  );
};

export default SecurityKPIs;
