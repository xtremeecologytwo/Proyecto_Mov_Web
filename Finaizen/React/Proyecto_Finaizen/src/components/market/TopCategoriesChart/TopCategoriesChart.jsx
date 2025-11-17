import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './TopCategoriesChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * TopCategoriesChart - Gráfico de barras de categorías de gasto con toggle tabla
 */
function TopCategoriesChart({ labels, datasets, title = 'Top 5 Categorías de Gasto' }) {
  const [showTable, setShowTable] = useState(false);

  const chartData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: index === 0 ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)',
      borderColor: index === 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.chartHeader}>
        <h3>{title}</h3>
        <button 
          className={styles.toggleBtn}
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? 'Ver Gráfico' : 'Ver Tabla'}
        </button>
      </div>

      {!showTable ? (
        <div className={styles.chartWrapper}>
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Categoría</th>
                {datasets.map((dataset, index) => (
                  <th key={index}>{dataset.label} (USD)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  {datasets.map((dataset, dsIndex) => (
                    <td key={dsIndex}>${dataset.data[index].toLocaleString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TopCategoriesChart;
