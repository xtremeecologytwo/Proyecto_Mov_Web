import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../ui';
import styles from './TransaccionesRecientes.module.css';

/**
 * TransaccionesRecientes - Sección de transacciones recientes del dashboard
 * @param {Array} historial - Lista de transacciones
 * @param {string} simboloMoneda - Símbolo de la moneda actual
 * @param {number} maxItems - Número máximo de items a mostrar (default: 8)
 */
function TransaccionesRecientes({ historial, simboloMoneda, maxItems = 8 }) {
  const navigate = useNavigate();

  return (
    <Card title="Transacciones Recientes" subtitle="Últimos movimientos" icon="📋">
      <div className={styles.historialList}>
        {historial.length === 0 ? (
          <p className={styles.emptyMessage}>No hay transacciones registradas</p>
        ) : (
          historial.slice(0, maxItems).map(registro => (
            <div key={registro.id} className={styles.historialItem}>
              <div className={styles.historialIcon}>
                {registro.tipo === 'ingreso' ? '💰' : '💸'}
              </div>
              <div className={styles.historialInfo}>
                <span className={styles.historialDescripcion}>{registro.descripcion}</span>
                <span className={styles.historialFecha}>
                  {new Date(registro.fechaEjecucion).toLocaleDateString()}
                </span>
              </div>
              <span className={`${styles.historialMonto} ${styles[registro.tipo]}`}>
                {registro.tipo === 'ingreso' ? '+' : '-'}
                {simboloMoneda}{registro.monto.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
      {historial.length > maxItems && (
        <Button 
          variant="link" 
          onClick={() => navigate('/user/historial')}
          className={styles.viewAllButton}
        >
          Ver todo el historial →
        </Button>
      )}
    </Card>
  );
}

TransaccionesRecientes.propTypes = {
  historial: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tipo: PropTypes.oneOf(['ingreso', 'egreso']).isRequired,
    descripcion: PropTypes.string.isRequired,
    monto: PropTypes.number.isRequired,
    fechaEjecucion: PropTypes.string.isRequired
  })).isRequired,
  simboloMoneda: PropTypes.string.isRequired,
  maxItems: PropTypes.number
};

export default TransaccionesRecientes;
