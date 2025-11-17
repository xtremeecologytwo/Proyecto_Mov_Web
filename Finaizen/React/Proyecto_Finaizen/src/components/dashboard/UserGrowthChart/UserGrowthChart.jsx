import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import styles from './UserGrowthChart.module.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * UserGrowthChart - Gráfico de líneas para crecimiento de usuarios
 * @param {Array} data - Array de objetos con { mes, usuarios }
 * @param {string} title - Título del gráfico
 */
function UserGrowthChart({ 
  data = [
    { mes: 'Ene', usuarios: 125 },
    { mes: 'Feb', usuarios: 150 },
    { mes: 'Mar', usuarios: 210 },
    { mes: 'Abr', usuarios: 250 },
    { mes: 'May', usuarios: 325 },
    { mes: 'Jun', usuarios: 400 }
  ],
  title = 'Crecimiento de Usuarios'
}) {
  const chartData = {
    labels: data.map(item => item.mes),
    datasets: [{
      label: 'Nuevos Usuarios',
      data: data.map(item => item.usuarios),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#5a5c69'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#5a5c69'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: {
            size: 12
          },
          color: '#5a5c69',
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} usuarios`;
          }
        }
      }
    }
  };

  return (
    <section className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
}

export default UserGrowthChart;
