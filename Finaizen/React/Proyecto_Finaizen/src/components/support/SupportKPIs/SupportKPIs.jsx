import styles from './SupportKPIs.module.css';

const SupportKPIs = ({ data }) => {
  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiCard}>
        <h4>Tickets Nuevos</h4>
        <p>{data.newTickets}</p>
        <span>En las últimas 24h</span>
      </div>
      <div className={styles.kpiCard}>
        <h4>Tickets Resueltos</h4>
        <p>{data.resolvedTickets}</p>
        <span>En las últimas 24h</span>
      </div>
      <div className={styles.kpiCard}>
        <h4>Tiempo de Respuesta Prom.</h4>
        <p>{data.avgResponseTime}</p>
        <span>En las últimas 24h</span>
      </div>
    </div>
  );
};

export default SupportKPIs;
