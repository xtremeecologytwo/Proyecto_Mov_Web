import MainLayout from '../../layouts/MainLayout';
import SimpleDoughnutChart from '../../components/charts/SimpleDoughnutChart';
import SimpleLineChart from '../../components/charts/SimpleLineChart';
import styles from './UserDashboard.module.css';

const historyItems = [
  { label: 'Café', amount: -8.5 },
  { label: 'Super', amount: -45.2 },
  { label: 'Salario', amount: 1500 },
];

const quickActions = [
  { href: 'nuevo-ingreso.html', label: 'Ingreso', variant: 'ingreso' },
  { href: 'nuevo-egreso.html', label: 'Gasto', variant: 'gasto' },
];

const budgetCards = [
  {
    title: 'Comida',
    current: 120.5,
    total: 150,
    alert: '⚠️ ¡Cuidado! Te queda poco presupuesto.',
  },
  {
    title: 'Transporte',
    current: 25,
    total: 60,
  },
];

const lineChartDataset = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  income: [1500, 1550, 1600, 1580, 1650, 1700],
  expenses: [600, 650, 620, 640, 660, 680],
};

const distributionDataset = [
  { label: 'Vivienda', value: 35 },
  { label: 'Comida', value: 28 },
  { label: 'Transporte', value: 12 },
  { label: 'Entretenimiento', value: 10 },
  { label: 'Otros', value: 15 },
];

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const UserDashboard = () => {
  const totalIncome = lineChartDataset.income[lineChartDataset.income.length - 1] ?? 0;
  const totalExpenses = lineChartDataset.expenses[lineChartDataset.expenses.length - 1] ?? 0;
  const savings = totalIncome - totalExpenses;

  const lineSeries = [
    {
      label: 'Ingresos',
      color: '#81C784',
      values: lineChartDataset.income,
    },
    {
      label: 'Gastos',
      color: '#E57373',
      values: lineChartDataset.expenses,
    },
  ];

  const doughnutColors = ['#81C784', '#4DB6AC', '#64B5F6', '#BA68C8', '#FFB74D'];

  return (
    <MainLayout>
      <main className={styles.dashboard}>
        <section className={styles.dashboardTop}>
          <article className={`${styles.card} ${styles.history}`}>
            <h3>Historial</h3>
            {historyItems.map((item) => (
              <p key={item.label}>
                {item.label}
                <span className={item.amount >= 0 ? styles.positive : styles.negative}>
                  {currencyFormatter.format(item.amount)}
                </span>
              </p>
            ))}
            <a href="historial.html">Ver historial</a>
            <div className={styles.buttons}>
              {quickActions.map((action) => (
                <a key={action.label} href={action.href} className={`${styles.btn} ${styles[action.variant]}`}>
                  {action.label}
                </a>
              ))}
            </div>
          </article>

          <div className={styles.cards}>
            {budgetCards.map((card) => (
              <article
                key={card.title}
                className={`${styles.card} ${card.alert ? styles.alertCard : styles.normalCard}`}
              >
                <h4>{card.title}</h4>
                <p>
                  {currencyFormatter.format(card.current)} / {currencyFormatter.format(card.total)}
                </p>
                {card.alert && <span className={styles.alert}>{card.alert}</span>}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.dashboardBottom}>
          <article className={`${styles.card} ${styles.summary}`}>
            <h3>Resumen Mensual</h3>
            <p>Ahorro = Ingreso - gastos</p>
            <h4>
              Ahorro: <span>{currencyFormatter.format(savings)}</span>
            </h4>
            <div className={styles.chartWrapper}>
              <SimpleLineChart
                labels={lineChartDataset.labels}
                series={lineSeries}
                title="Evolución de ingresos y gastos en el semestre"
              />
            </div>
          </article>

          <article className={`${styles.card} ${styles.distribution}`}>
            <h4>Distribución</h4>
            <div className={styles.chartWrapper}>
              <SimpleDoughnutChart
                data={distributionDataset}
                colors={doughnutColors}
                title="Distribución porcentual de gastos por categoría"
              />
            </div>
          </article>
        </section>
      </main>
    </MainLayout>
  );
};

export default UserDashboard;
