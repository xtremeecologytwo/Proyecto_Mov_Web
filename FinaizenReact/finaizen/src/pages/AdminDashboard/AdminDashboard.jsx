import MainLayout from '../../layouts/MainLayout';
import SimpleLineChart from '../../components/charts/SimpleLineChart';
import styles from './AdminDashboard.module.css';

const summaryCards = [
  { title: 'Usuarios Activos', value: '1428' },
  { title: 'Cuentas creadas', value: '1428' },
  { title: 'Reportes', value: '12' },
];

const userGrowthSeries = [
  {
    label: 'Usuarios activos',
    color: '#4e73df',
    values: [950, 1020, 1100, 1205, 1310, 1428],
  },
];

const userGrowthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

const AdminDashboard = () => {
  return (
    <MainLayout>
      <main className={styles.dashboardAdmin}>
        <section className={styles.summaryCards}>
          {summaryCards.map((card) => (
            <article key={card.title} className={`${styles.card} ${styles.summaryCard}`}>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </article>
          ))}
        </section>

        <section className={`${styles.card} ${styles.chartContainer}`}>
          <h3>Crecimiento de Usuarios</h3>
          <div className={styles.chartWrapper}>
            <SimpleLineChart
              labels={userGrowthLabels}
              series={userGrowthSeries}
              title="Crecimiento de usuarios activos durante el primer semestre"
            />
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default AdminDashboard;
