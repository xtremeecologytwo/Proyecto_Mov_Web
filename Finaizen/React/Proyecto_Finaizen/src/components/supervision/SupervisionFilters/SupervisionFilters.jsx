import styles from './SupervisionFilters.module.css';

function SupervisionFilters({ onConfidenceFilter, onSearch }) {
  return (
    <div className={styles.filtersBar}>
      <select onChange={(e) => onConfidenceFilter(e.target.value)} className={styles.filterSelect}>
        <option value="todos">Todos los niveles</option>
        <option value="alta">Confianza Alta</option>
        <option value="media">Confianza Media</option>
        <option value="baja">Confianza Baja</option>
      </select>
      <input
        type="text"
        placeholder="Buscar por descripción..."
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SupervisionFilters;
