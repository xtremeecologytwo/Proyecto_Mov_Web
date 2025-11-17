import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './IncomeSourceChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * IncomeSourceChart - Gráfico de dona para fuentes de ingreso
 */
function IncomeSourceChart({ labels, data, title = 'Fuentes de Ingreso' }) {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <section className={styles.card}>
      <h3>{title}</h3>
      <div className={styles.chartWrapper}>
        <Doughnut data={chartData} options={options} />
      </div>
    </section>
  );
}

export default IncomeSourceChart;
