import MainLayout from '../../layouts/MainLayout';
import styles from './Home.module.css';

const Home = () => (
  <MainLayout>
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Gestión financiera inteligente</p>
        <h1 className={styles.title}>Impulsa tu banca digital con Finaizen</h1>
        <p className={styles.subtitle}>
          Centraliza datos, automatiza reportes y ofrece experiencias personalizadas
          con una plataforma pensada para equipos de producto y finanzas.
        </p>
        <div className={styles.actions}>
          <a className={styles.ctaPrimary} href="#demo">
            Solicitar demo
          </a>
          <a className={styles.ctaSecondary} href="#docs">
            Ver documentación
          </a>
        </div>
      </div>
      <div className={styles.heroCard}>
        <h2 className={styles.cardTitle}>Panel resumido</h2>
        <ul className={styles.cardList}>
          <li>
            <span className={styles.metricLabel}>Clientes activos</span>
            <span className={styles.metricValue}>12.4K</span>
          </li>
          <li>
            <span className={styles.metricLabel}>Tasa de retención</span>
            <span className={styles.metricValue}>92%</span>
          </li>
          <li>
            <span className={styles.metricLabel}>Tickets resueltos</span>
            <span className={styles.metricValue}>1.2K</span>
          </li>
        </ul>
      </div>
    </section>
  </MainLayout>
);

export default Home;
