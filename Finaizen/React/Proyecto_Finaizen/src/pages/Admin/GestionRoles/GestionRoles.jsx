import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import RoleCard from '../../../components/roles/RoleCard';
import RoleModal from '../../../components/roles/RoleModal';
import DeleteRoleModal from '../../../components/roles/DeleteRoleModal';
import { initialRoles, allPermissions } from '../../../utils/rolesData';
import styles from './GestionRoles.module.css';

/**
 * GestionRoles - Página de gestión de roles y permisos
 */
function GestionRoles() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roles, setRoles] = useState(initialRoles);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Proteger ruta
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    if (role.protected) return;
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = (roleData) => {
    if (roleData.id) {
      // Editar rol existente
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === roleData.id ? { ...role, ...roleData } : role
        )
      );
    } else {
      // Agregar nuevo rol
      const newRole = {
        ...roleData,
        id: Math.max(...roles.map(r => r.id), 0) + 1,
        userCount: 0,
        protected: false
      };
      setRoles(prevRoles => [...prevRoles, newRole]);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      setRoles(prevRoles => prevRoles.filter(role => role.id !== selectedRole.id));
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  // Configuración del menú
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Gestión de Usuarios', path: '/admin/gestion-usuarios' },
    { label: 'Gestión de Roles', path: '/admin/gestion-roles' },
    { label: 'Supervisión de Categorías', path: '/admin/supervision-categorias' },
    { label: 'Registro de Seguridad', path: '/admin/registro-seguridad' },
    { label: 'Inteligencia de Mercado', path: '/admin/inteligencia-mercado' },
    { label: 'Reportes y Soporte', path: '/admin/reportes-soporte' }
  ];

  const userMenuItems = [
    { label: 'Mi Perfil', path: '/config/perfil', icon: '👤' },
    { label: 'Configuración', path: '/config/cuenta', icon: '⚙️' }
  ];

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Roles</h2>
            <button className={styles.btnAddRole} onClick={handleAddRole}>
              Agregar Rol
            </button>
          </div>

          <div className={styles.rolesList}>
            {roles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
              />
            ))}
          </div>
        </section>
      </main>

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
        allPermissions={allPermissions}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        roleName={selectedRole?.name}
      />
    </div>
  );
}

export default GestionRoles;
