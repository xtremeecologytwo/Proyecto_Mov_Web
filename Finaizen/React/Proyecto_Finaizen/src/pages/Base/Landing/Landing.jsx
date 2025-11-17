import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../../../components/layout';
import { Button } from '../../../components/ui';
import dashboardImg from '../../../assets/dashboard.png';
import administrarImg from '../../../assets/administrar_registros.png';
import ingresoImg from '../../../assets/nuevo_ingreso.png';
import egresoImg from '../../../assets/nuevo_egreso.png';
import ahorroImg from '../../../assets/plan_ahorro.png';
import presupuestosImg from '../../../assets/presupuestos.png';
import styles from './Landing.module.css';

function Landing() {
  return (
    <div className={styles.landingPage}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Organiza tu Dinero. <span className={styles.brand}>Vive Mejor.</span>
          </h1>
          <p className={styles.subtitle}>
            "Donde cada gasto tiene un propósito y cada meta se hace realidad."
          </p>
          <div className={styles.heroActions}>
            <Link to="/register"><Button variant="brand">Comenzar Gratis</Button></Link>
            <Link to="/login"><Button variant="outline">Iniciar Sesión</Button></Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.feature}>
        <div className={styles.featureContainer}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Dashboard Intuitivo</h2>
            <p className={styles.featureDesc}>
              Visualiza un resumen completo de tus finanzas en un solo lugar. Con nuestro Dashboard, puedes ver tu historial, un resumen mensual de ahorros (Ingresos - Gastos), y la distribución de tus egresos con gráficos circulares claros. ¡Toma el control a simple vista!
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={dashboardImg} alt="Dashboard" />
          </div>
        </div>
      </section>

      <section className={`${styles.feature} ${styles.alt}`}>
        <div className={`${styles.featureContainer} ${styles.reverse}`}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Administra Registros de Ingresos y Egresos</h2>
            <p className={styles.featureDesc}>
              Organiza y revisa todos tus movimientos financieros de forma sencilla. Filtra, ordena y edita ingresos y egresos para mantener todo bajo control.
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={administrarImg} alt="Administrar Registros" />
          </div>
        </div>
      </section>

      <section className={styles.feature}>
        <div className={styles.featureContainer}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Registra un Nuevo Ingreso</h2>
            <p className={styles.featureDesc}>
              Especifica monto, descripción y frecuencia para añadir automáticamente a tu flujo de caja.
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={ingresoImg} alt="Nuevo Ingreso" />
          </div>
        </div>
      </section>

      <section className={`${styles.feature} ${styles.alt}`}>
        <div className={`${styles.featureContainer} ${styles.reverse}`}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Registra un Nuevo Egreso</h2>
            <p className={styles.featureDesc}>
              Clasifica tus gastos, elige la frecuencia y selecciona la fecha exacta para un mejor seguimiento.
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={egresoImg} alt="Nuevo Egreso" />
          </div>
        </div>
      </section>

      <section className={styles.feature}>
        <div className={styles.featureContainer}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Planifica tus Ahorros</h2>
            <p className={styles.featureDesc}>
              Define cuánto deseas ahorrar mensualmente y te ayudamos a calcular cómo alcanzar tu meta.
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={ahorroImg} alt="Plan de Ahorro" />
          </div>
        </div>
      </section>

      <section className={`${styles.feature} ${styles.alt}`}>
        <div className={`${styles.featureContainer} ${styles.reverse}`}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Gestiona tus Presupuestos Mensuales</h2>
            <p className={styles.featureDesc}>
              Crea presupuestos para categorías clave. Recibe alertas si estás por exceder tu límite.
            </p>
          </div>
          <div className={styles.featureMedia}>
            <img src={presupuestosImg} alt="Presupuestos" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
