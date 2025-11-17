import styles from './InsightsCard.module.css';

/**
 * InsightsCard - Tarjeta de análisis automático
 */
function InsightsCard({ insightText }) {
  return (
    <section className={styles.insightsCard}>
      <h4>Análisis Automático</h4>
      <p dangerouslySetInnerHTML={{ __html: insightText }} />
    </section>
  );
}

export default InsightsCard;
