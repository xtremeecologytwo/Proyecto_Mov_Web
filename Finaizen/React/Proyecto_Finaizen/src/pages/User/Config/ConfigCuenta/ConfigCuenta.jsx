import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import mockDB, { EventTypes, EventCategories, SeverityLevels, EventStatus } from '../../../../utils/mockDatabase';
import { Card, Button, Input, Select, Toast } from '../../../../components/ui';
import styles from './ConfigCuenta.module.css';

const ConfigCuenta = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    pais: '',
    ciudad: '',
    genero: ''
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userData = {
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        email: currentUser.correo || currentUser.email || '',
        fechaNacimiento: currentUser.fechaNacimiento ? 
          (currentUser.fechaNacimiento instanceof Date ? 
            currentUser.fechaNacimiento.toISOString().split('T')[0] : 
            new Date(currentUser.fechaNacimiento).toISOString().split('T')[0]) : '',
        pais: currentUser.pais || '',
        ciudad: currentUser.ciudad || '',
        genero: currentUser.genero || ''
      };
      setFormData(userData);
      setOriginalEmail(currentUser.correo || currentUser.email || '');
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén llenos
      if (!formData.nombre || !formData.apellido || !formData.email) {
        showToast('Por favor completa todos los campos requeridos', 'error');
        setIsLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showToast('Por favor ingresa un email válido', 'error');
        setIsLoading(false);
        return;
      }

      // Verificar si el email cambió
      const emailChanged = formData.email !== originalEmail;

      // Si el email cambió, verificar que no esté en uso
      if (emailChanged) {
        const existingUser = mockDB.users.find(
          u => u.correo === formData.email && u.id !== currentUser.id
        );
        if (existingUser) {
          showToast('El email ya está en uso por otra cuenta', 'error');
          setIsLoading(false);
          return;
        }
      }

      // Obtener el usuario actual desde mockDB (instancia de User)
      const userFromDB = mockDB.users.find(u => u.id === currentUser.id);
      
      if (!userFromDB) {
        showToast('Usuario no encontrado', 'error');
        setIsLoading(false);
        return;
      }

      // Actualizar propiedades directamente en la instancia de User
      userFromDB.nombre = formData.nombre;
      userFromDB.apellido = formData.apellido;
      userFromDB.correo = formData.email;
      userFromDB.fechaNacimiento = formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : userFromDB.fechaNacimiento;
      userFromDB.pais = formData.pais;
      userFromDB.ciudad = formData.ciudad;
      userFromDB.genero = formData.genero;
      userFromDB.updatedAt = new Date();
      
      // Guardar en localStorage
      mockDB.saveToLocalStorage();

      // Actualizar contexto con la instancia actualizada
      updateUser(userFromDB);

      // Crear log de cambio de perfil
      mockDB.createSecurityLog({
        userId: currentUser.id,
        userEmail: formData.email,
        eventType: EventTypes.PROFILE_UPDATED,
        eventCategory: EventCategories.CONFIGURACION,
        description: 'Información de cuenta actualizada',
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.LOW,
        metadata: {
          fieldsChanged: Object.keys(formData).filter(
            key => formData[key] !== currentUser[key]
          )
        }
      });

      // Si el email cambió, crear log adicional
      if (emailChanged) {
        mockDB.createSecurityLog({
          userId: currentUser.id,
          userEmail: formData.email,
          eventType: EventTypes.EMAIL_CHANGED,
          eventCategory: EventCategories.CONFIGURACION,
          description: `Email cambiado de ${originalEmail} a ${formData.email}`,
          status: EventStatus.SUCCESS,
          severity: SeverityLevels.MEDIUM,
          metadata: {
            oldEmail: originalEmail,
            newEmail: formData.email
          }
        });
        setOriginalEmail(formData.email);
      }

      showToast('✅ Información actualizada correctamente', 'success');
      
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      showToast('❌ Error al actualizar la información', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generoOptions = [
    { value: '', label: 'Seleccionar...', disabled: true },
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Mujer', label: 'Mujer' },
    { value: 'Otro', label: 'Otro' },
    { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' }
  ];

  return (
    <div className={styles.configCuentaPage}>
      <Card>
        <h1 className={styles.title}>👤 Cuenta</h1>
        <p className={styles.subtitle}>Actualiza tu información personal aquí.</p>

        <form onSubmit={handleSubmit} className={styles.accountForm}>
          {/* Fila 1: Nombre y Apellido */}
          <div className={styles.formRow}>
            <Input
              label="Nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Juan"
            />
            <Input
              label="Apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Ej: Pérez"
            />
          </div>

          {/* Fila 2: Correo */}
          <div>
            <Input
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
            />
            {formData.email !== originalEmail && (
              <small className={styles.warningText}>
                ⚠️ Cambiar el email afectará tu inicio de sesión
              </small>
            )}
          </div>

          {/* Fila 3: Fecha de Nacimiento */}
          <Input
            label="Fecha de nacimiento"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />

          {/* Fila 4: País y Ciudad */}
          <div className={styles.formRow}>
            <Input
              label="País"
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              placeholder="Ej: Ecuador"
            />
            <Input
              label="Ciudad"
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="Ej: Quito"
            />
          </div>

          {/* Fila 5: Género */}
          <Select
            label="Género"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            options={generoOptions}
          />

          {/* Acciones */}
          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>

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

export default ConfigCuenta;
