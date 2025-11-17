import Card from '../../ui/Card';
import styles from './AdminSummaryCards.module.css';

/**
 * AdminSummaryCards - Tarjetas de resumen para el dashboard de administrador
 * @param {Object} stats - Estadísticas a mostrar { usuariosActivos, cuentasCreadas, reportes }
 */
function AdminSummaryCards({ stats = { usuariosActivos: 0, cuentasCreadas: 0, reportes: 0 } }) {
  const cards = [
    {
      title: 'Usuarios Activos',
      value: stats.usuariosActivos,
      icon: '👥',
      color: '#4e73df'
    },
    {
      title: 'Cuentas creadas',
      value: stats.cuentasCreadas,
      icon: '➕',
      color: '#1cc88a'
    },
    {
      title: 'Reportes',
      value: stats.reportes,
      icon: '📄',
      color: '#f6c23e'
    }
  ];

  return (
    <section className={styles.summaryCards}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={styles.summaryCard}
          style={{ borderLeftColor: card.color }}
        >
          <div className={styles.cardIcon} style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className={styles.cardContent}>
            <h3>{card.title}</h3>
            <p>{card.value.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default AdminSummaryCards;
