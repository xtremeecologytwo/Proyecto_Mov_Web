import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PresupuestoCard } from '../../ui';
import styles from './PresupuestosSection.module.css';

/**
 * PresupuestosSection - Sección de presupuestos del dashboard
 * @param {Array} presupuestos - Lista de presupuestos activos
 * @param {string} simboloMoneda - Símbolo de la moneda actual
 */
function PresupuestosSection({ presupuestos, simboloMoneda }) {
  const navigate = useNavigate();

  return (
    <Card title="Presupuestos" subtitle={`${presupuestos.length} activos`} icon="🎯">
      <div className={styles.presupuestosList}>
        {presupuestos.length === 0 ? (
          <p className={styles.emptyMessage}>No tienes presupuestos configurados</p>
        ) : (
          presupuestos.slice(0, 3).map(pres => (
            <PresupuestoCard
              key={pres.id}
              presupuesto={pres}
              simboloMoneda={simboloMoneda}
              showActions={false}
              compact={false}
            />
          ))
        )}
      </div>
      {presupuestos.length > 0 && (
        <Button 
          variant="link" 
          onClick={() => navigate('/user/presupuestos')}
          className={styles.viewAllButton}
        >
          Ver todos →
        </Button>
      )}
    </Card>
  );
}

PresupuestosSection.propTypes = {
  presupuestos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
    montoLimite: PropTypes.number.isRequired,
    montoGastado: PropTypes.number,
    porcentajeGastado: PropTypes.number,
    estado: PropTypes.string,
    alertaEn: PropTypes.number
  })).isRequired,
  simboloMoneda: PropTypes.string.isRequired
};

export default PresupuestosSection;
