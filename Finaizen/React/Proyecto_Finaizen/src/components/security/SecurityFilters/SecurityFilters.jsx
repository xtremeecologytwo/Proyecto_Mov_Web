import styles from './SecurityFilters.module.css';

const SecurityFilters = ({ eventFilter, searchValue, onEventFilterChange, onSearchChange }) => {
  return (
    <div className={styles.filtersBar}>
      <select 
        value={eventFilter} 
        onChange={(e) => onEventFilterChange(e.target.value)}
        className={styles.select}
      >
        <option value="todos">Todos los eventos</option>
        <option value="fallido">Inicio de Sesión Fallido</option>
        <option value="exitoso">Inicio de Sesión Exitoso</option>
        <option value="modificacion">Modificación de Cuenta</option>
      </select>
      <input 
        type="text" 
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar por usuario o IP..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SecurityFilters;
