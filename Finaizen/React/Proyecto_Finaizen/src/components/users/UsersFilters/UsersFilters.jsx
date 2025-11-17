import styles from './UsersFilters.module.css';

/**
 * UsersFilters - Barra de filtros y búsqueda
 */
function UsersFilters({ onSearch, onRoleFilter, onStatusFilter }) {
  return (
    <div className={styles.filtersBar}>
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
      />
      
      <select 
        onChange={(e) => onRoleFilter(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="todos">Todos los roles</option>
        <option value="usuario">usuario</option>
        <option value="admin">admin</option>
        <option value="analista">analista</option>
        <option value="supervisor">supervisor</option>
        <option value="soporte">soporte</option>
      </select>

      <select 
        onChange={(e) => onStatusFilter(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="todos">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="suspendido">Suspendido</option>
      </select>
    </div>
  );
}

export default UsersFilters;
