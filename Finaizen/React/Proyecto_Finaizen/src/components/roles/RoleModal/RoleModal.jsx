import { useState, useEffect } from 'react';
import styles from './RoleModal.module.css';

/**
 * RoleModal - Modal para agregar/editar roles
 */
function RoleModal({ isOpen, onClose, onSave, role, allPermissions }) {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
  }, [role, isOpen]);

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      alert('El nombre del rol no puede estar vacío.');
      return;
    }

    onSave({
      id: role?.id,
      name: roleName,
      permissions: selectedPermissions,
      userCount: role?.userCount || 0,
      protected: role?.protected || false
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{role ? `Editar Rol: ${role.name}` : 'Agregar Nuevo Rol'}</h3>
        
        <input
          type="text"
          className={styles.roleNameInput}
          placeholder="Nombre del Rol"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />

        <h4>Permisos</h4>
        <div className={styles.permissionsGrid}>
          {allPermissions.map((permission) => (
            <div key={permission} className={styles.permissionItem}>
              <input
                type="checkbox"
                id={`perm-${permission.replace(/\s+/g, '')}`}
                checked={selectedPermissions.includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
              />
              <label htmlFor={`perm-${permission.replace(/\s+/g, '')}`}>
                {permission}
              </label>
            </div>
          ))}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnSave} onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleModal;
