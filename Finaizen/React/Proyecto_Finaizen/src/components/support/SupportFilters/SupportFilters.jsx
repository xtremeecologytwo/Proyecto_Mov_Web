import styles from './SupportFilters.module.css';

const SupportFilters = ({ statusFilter, searchValue, onStatusChange, onSearchChange }) => {
  return (
    <div className={styles.filtersBar}>
      <select 
        value={statusFilter} 
        onChange={(e) => onStatusChange(e.target.value)}
        className={styles.select}
      >
        <option value="todos">Todos los estados</option>
        <option value="nuevo">Nuevo</option>
        <option value="pendiente">Pendiente</option>
        <option value="resuelto">Resuelto</option>
        <option value="escalado">Escalado</option>
      </select>
      <input 
        type="text" 
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar por usuario o asunto..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SupportFilters;
