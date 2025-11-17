import styles from './RoleCard.module.css';

/**
 * RoleCard - Tarjeta de rol individual
 */
function RoleCard({ role, onEdit, onDelete }) {
  return (
    <div className={styles.roleCard}>
      <div className={styles.roleInfo}>
        <h4>
          {role.name} <span>({role.userCount} usuarios)</span>
        </h4>
        <div className={styles.permissionsTags}>
          {role.permissions.map((permission, index) => (
            <span key={index} className={styles.permissionTag}>
              {permission}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.roleActions}>
        <button 
          className={styles.btnEdit} 
          onClick={() => onEdit(role)}
        >
          Editar
        </button>
        <button 
          className={styles.btnDelete} 
          onClick={() => onDelete(role)}
          disabled={role.protected}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default RoleCard;
