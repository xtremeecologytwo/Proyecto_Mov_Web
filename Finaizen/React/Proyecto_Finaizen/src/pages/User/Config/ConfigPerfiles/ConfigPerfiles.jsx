import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import mockDB, { EventTypes, EventCategories, SeverityLevels, EventStatus } from '../../../../utils/mockDatabase';
import Perfil from '../../../../models/Perfil';
import { Toast } from '../../../../components/ui';
import ProfileCard from '../../../../components/cards/ProfileCard';
import ProfileModal from '../../../../components/modals/ProfileModal';
import styles from './ConfigPerfiles.module.css';

const ConfigPerfiles = () => {
  const { currentUser, perfiles, cambiarPerfil, actualizarPerfiles, currentPerfil } = useAuth();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleOpenModal = (perfil = null) => {
    setEditingPerfil(perfil);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerfil(null);
  };

  const handleSubmit = (formData) => {
    if (!formData.nombre.trim()) {
      showToast('El nombre del perfil es requerido', 'error');
      return;
    }

    try {
      if (editingPerfil) {
        // Editar perfil existente
        const perfilIndex = mockDB.perfiles.findIndex(p => p.id === editingPerfil.id);
        if (perfilIndex !== -1) {
          mockDB.perfiles[perfilIndex] = {
            ...mockDB.perfiles[perfilIndex],
            nombre: formData.nombre,
            moneda: formData.moneda
          };
          mockDB.saveToLocalStorage();

          mockDB.createSecurityLog({
            userId: currentUser.id,
            userEmail: currentUser.email,
            eventType: EventTypes.PROFILE_UPDATED,
            eventCategory: EventCategories.CONFIGURACION,
            description: `Perfil "${formData.nombre}" actualizado`,
            status: EventStatus.SUCCESS,
            severity: SeverityLevels.LOW,
            metadata: { perfilId: editingPerfil.id }
          });

          actualizarPerfiles();
          handleCloseModal();
          showToast('✅ Perfil actualizado correctamente', 'success');
        }
      } else {
        // Crear nuevo perfil
        // Generar nuevo ID
        const newPerfilId = mockDB.perfiles.length > 0
          ? Math.max(...mockDB.perfiles.map(p => p.id)) + 1
          : 1;

        // Obtener símbolo de moneda según la moneda seleccionada
        const simbolosMoneda = {
          'USD': '$',
          'EUR': '€',
          'MXN': '$',
          'COP': '$'
        };
        
        // Crear el nuevo perfil
        const newPerfil = new Perfil({
          id: newPerfilId,
          userId: currentUser.id,
          nombre: formData.nombre,
          moneda: formData.moneda,
          simboloMoneda: simbolosMoneda[formData.moneda] || '$'
        });

        // Agregar perfil al usuario y a la base de datos
        const userFromDB = mockDB.users.find(u => u.id === currentUser.id);
        userFromDB.agregarPerfil(newPerfil.id);
        mockDB.perfiles.push(newPerfil);
        mockDB.saveToLocalStorage();

        mockDB.createSecurityLog({
          userId: currentUser.id,
          userEmail: currentUser.email,
          eventType: EventTypes.PERFIL_CREATED,
          eventCategory: EventCategories.CONFIGURACION,
          description: `Nuevo perfil "${formData.nombre}" creado`,
          status: EventStatus.SUCCESS,
          severity: SeverityLevels.LOW,
          metadata: { perfilId: newPerfil.id }
        });

        actualizarPerfiles();
        handleCloseModal();
        showToast('✅ Perfil creado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      showToast('❌ Error al guardar el perfil', 'error');
    }
  };

  const handleDelete = (perfil) => {
    if (perfiles.length <= 1) {
      showToast('⚠️ Debes tener al menos un perfil', 'warning');
      return;
    }

    if (perfil.id === currentPerfil?.id) {
      showToast('⚠️ No puedes eliminar el perfil activo', 'warning');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el perfil "${perfil.nombre}"?`)) {
      const index = mockDB.perfiles.findIndex(p => p.id === perfil.id);
      if (index !== -1) {
        mockDB.perfiles.splice(index, 1);
        mockDB.saveToLocalStorage();

        mockDB.createSecurityLog({
          userId: currentUser.id,
          userEmail: currentUser.email,
          eventType: EventTypes.PERFIL_DELETED,
          eventCategory: EventCategories.CONFIGURACION,
          description: `Perfil "${perfil.nombre}" eliminado`,
          status: EventStatus.SUCCESS,
          severity: SeverityLevels.MEDIUM,
          metadata: { perfilId: perfil.id }
        });

        showToast('✅ Perfil eliminado correctamente', 'success');
        actualizarPerfiles();
      }
    }
  };

  const handleSwitchPerfil = (perfil) => {
    if (perfil.id === currentPerfil?.id) {
      showToast('ℹ️ Este perfil ya está activo', 'info');
      return;
    }

    cambiarPerfil(perfil.id);
    showToast(`✅ Cambiado a perfil: ${perfil.nombre}`, 'success');
  };

  return (
    <div className={styles.configPerfilesPage}>
      <div className={styles.profilesManagementCard}>
        <h1>💼 Administrar perfiles</h1>
        <p className={styles.subtitle}>
          Gestiona tus perfiles de finanzas para mantener todo organizado.
        </p>

        <div className={styles.profilesContainer}>
          {perfiles.map(perfil => (
            <ProfileCard
              key={perfil.id}
              perfil={perfil}
              isActive={perfil.id === currentPerfil?.id}
              onSwitch={handleSwitchPerfil}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}

          {/* Card para agregar */}
          <article 
            className={styles.profileCardAdd}
            onClick={() => handleOpenModal()}
          >
            <div className={styles.addIcon}>➕</div>
            <div>Agregar Perfil</div>
          </article>
        </div>
      </div>

      <ProfileModal
        show={showModal}
        perfil={editingPerfil}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ConfigPerfiles;
