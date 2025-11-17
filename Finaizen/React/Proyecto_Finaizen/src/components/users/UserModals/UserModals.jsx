import styles from './UserModals.module.css';

/**
 * ViewUserModal - Modal para ver perfil de usuario
 */
export function ViewUserModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Perfil de Usuario</h3>
        <div className={styles.userInfo}>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Estado:</strong> {user.status}</p>
          <p><strong>Miembro desde:</strong> {user.date}</p>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.btnClose} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * EditRoleModal - Modal para modificar rol de usuario
 */
export function EditRoleModal({ isOpen, onClose, user, roles, onSave }) {
  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRole = e.target.role.value;
    onSave(user.id, newRole);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Modificar Rol de {user.name}</h3>
        <form onSubmit={handleSubmit}>
          <select name="role" defaultValue={user.role} className={styles.roleSelect}>
            {Object.keys(roles).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * InviteUserModal - Modal para invitar nuevo usuario
 */
export function InviteUserModal({ isOpen, onClose, roles, onInvite }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const role = e.target.role.value;
    
    if (!email) {
      alert('El email es obligatorio');
      return;
    }

    onInvite(email, role);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Invitar Nuevo Usuario</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email del usuario"
            className={styles.emailInput}
            required
          />
          <select name="role" className={styles.roleSelect}>
            {Object.keys(roles).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Enviar Invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * ConfirmActionModal - Modal de confirmación genérico
 */
export function ConfirmActionModal({ isOpen, onClose, user, action, onConfirm }) {
  if (!isOpen || !user) return null;

  const actionText = action === 'suspend' ? 'suspender' : 'reactivar';

  const handleConfirm = () => {
    onConfirm(user.id);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Confirmar Acción</h3>
        <p>
          ¿Estás seguro de que quieres {actionText} a <strong>{user.name}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
