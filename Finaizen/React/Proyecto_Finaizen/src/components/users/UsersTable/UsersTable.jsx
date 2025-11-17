import { useState } from 'react';
import styles from './UsersTable.module.css';

/**
 * UsersTable - Tabla de usuarios con dropdown de acciones
 */
function UsersTable({ users, onViewUser, onEditRole, onToggleStatus }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (userId) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleAction = (action, userId) => {
    setOpenDropdown(null);
    action(userId);
  };

  const getRoleClass = (role) => {
    const roleMap = {
      'usuario': 'usuario',
      'admin': 'admin',
      'analista': 'analista',
      'supervisor': 'supervisor',
      'soporte': 'soporte'
    };
    return roleMap[role] || 'usuario';
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.date}</td>
              <td>
                <span className={`${styles.status} ${styles[user.status]}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <span className={`${styles.role} ${styles[getRoleClass(user.role)]}`}>
                  {user.role}
                </span>
              </td>
              <td className={styles.actionsDropdown}>
                <button 
                  className={styles.dropdownToggle}
                  onClick={() => toggleDropdown(user.id)}
                >
                  ⋮
                </button>
                {openDropdown === user.id && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => handleAction(onViewUser, user.id)}>
                      Ver Perfil
                    </button>
                    <button onClick={() => handleAction(onEditRole, user.id)}>
                      Modificar Rol
                    </button>
                    <button onClick={() => handleAction(onToggleStatus, user.id)}>
                      {user.status === 'activo' ? 'Suspender' : 'Reactivar'}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
