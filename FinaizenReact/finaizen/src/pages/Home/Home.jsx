import MainLayout from '../../layouts/MainLayout';
import styles from './Home.module.css';

const Home = ({ onNavigate, legacyGroups }) => {
  const handleNavigate = (path) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    }
  };

  return (
    <MainLayout>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Gestión financiera inteligente</p>
          <h1 className={styles.title}>Impulsa tu banca digital con Finaizen</h1>
          <p className={styles.subtitle}>
            Centraliza datos, automatiza reportes y ofrece experiencias personalizadas con una
            plataforma pensada para equipos de producto y finanzas.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.ctaPrimary} onClick={() => handleNavigate('/legacy/base')}>
              Explorar prototipo
            </button>
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

      {Array.isArray(legacyGroups) && legacyGroups.length > 0 && (
        <section className={styles.legacySection}>
          <div className={styles.legacyIntro}>
            <h2>Aplicación original en HTML</h2>
            <p>
              Accede a cada pantalla del prototipo clásico mientras continúas desarrollando la
              versión moderna en React. Todas las vistas conservan sus estilos y scripts
              originales dentro de la aplicación.
            </p>
          </div>
          <div className={styles.legacyGrid}>
            {legacyGroups.map((group) => (
              <article key={group.title} className={styles.legacyCard}>
                <header className={styles.legacyCardHeader}>
                  <span className={styles.legacyBadge}>Colección</span>
                  <h3>{group.title}</h3>
                </header>
                <ul className={styles.legacyList}>
                  {group.routes.map((route) => (
                    <li key={route.path}>
                      <button
                        type="button"
                        className={styles.legacyLink}
                        onClick={() => handleNavigate(route.path)}
                      >
                        {route.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default Home;
