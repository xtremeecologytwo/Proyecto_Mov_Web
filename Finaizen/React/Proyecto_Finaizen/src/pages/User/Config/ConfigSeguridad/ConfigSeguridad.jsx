import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import mockDB, { EventTypes, EventCategories, SeverityLevels, EventStatus } from '../../../../utils/mockDatabase';
import { Card, Button, Input, Toggle, Toast } from '../../../../components/ui';
import styles from './ConfigSeguridad.module.css';

const ConfigSeguridad = () => {
  const { currentUser, updateUser } = useAuth();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setTwoFactorEnabled(mockDB.securityConfig.require2FA || false);
    }
  }, [currentUser]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');

    if (passwords.new !== passwords.confirm) {
      setPasswordError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    // Obtener el usuario actual directamente desde mockDB para asegurar que tenga todos los métodos
    const userFromDB = mockDB.users.find(u => u.id === currentUser.id);
    
    if (!userFromDB || !userFromDB.verificarContraseña(passwords.current)) {
      setPasswordError('La contraseña actual es incorrecta');
      setIsLoading(false);

      mockDB.createSecurityLog({
        userId: currentUser.id,
        userEmail: currentUser.email || currentUser.correo,
        eventType: EventTypes.PASSWORD_CHANGE_FAILED,
        eventCategory: EventCategories.CONFIGURACION,
        description: 'Intento fallido de cambio de contraseña - contraseña actual incorrecta',
        status: EventStatus.FAILURE,
        severity: SeverityLevels.MEDIUM
      });

      return;
    }

    try {
      // Actualizar contraseña directamente en la instancia de User
      userFromDB.contraseña = passwords.new;
      userFromDB.updatedAt = new Date();
      mockDB.saveToLocalStorage();
      
      // Actualizar contexto con el usuario actualizado
      updateUser(userFromDB);

      mockDB.createSecurityLog({
        userId: currentUser.id,
        userEmail: currentUser.email || currentUser.correo,
        eventType: EventTypes.PASSWORD_CHANGED,
        eventCategory: EventCategories.CONFIGURACION,
        description: 'Contraseña cambiada exitosamente',
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.LOW
      });

      setPasswords({ current: '', new: '', confirm: '' });
      showToast('✅ Contraseña actualizada correctamente', 'success');

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showToast('❌ Error al cambiar la contraseña', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = (newValue) => {
    setTwoFactorEnabled(newValue);
    mockDB.securityConfig.require2FA = newValue;
    mockDB.saveToLocalStorage();

    mockDB.createSecurityLog({
      userId: currentUser.id,
      userEmail: currentUser.email,
      eventType: newValue ? EventTypes.TWO_FACTOR_ENABLED : EventTypes.TWO_FACTOR_DISABLED,
      eventCategory: EventCategories.CONFIGURACION,
      description: `Autenticación de dos factores ${newValue ? 'activada' : 'desactivada'}`,
      status: EventStatus.SUCCESS,
      severity: SeverityLevels.MEDIUM
    });

    showToast(
      `${newValue ? '✅ 2FA activado' : '⚠️ 2FA desactivado'}`, 
      newValue ? 'success' : 'warning'
    );
  };

  return (
    <div className={styles.configSeguridadPage}>
      <h1 className={styles.title}>🔒 Seguridad</h1>
      <p className={styles.subtitle}>
        Cambia tu contraseña y gestiona la seguridad de tu cuenta.
      </p>

      <div className={styles.sectionsContainer}>
        <Card className={styles.passwordCard}>
          <h2 className={styles.sectionTitle}>Cambiar Contraseña</h2>

          <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
            <Input
              label="Contraseña actual"
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña actual"
              required
            />

            <Input
              label="Nueva contraseña"
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder="Mínimo 8 caracteres"
              required
            />

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              placeholder="Repite la nueva contraseña"
              required
            />

            <div className={styles.passwordRequirements}>
              <p>Requisitos de la contraseña:</p>
              <ul>
                <li>Mínimo 8 caracteres</li>
                <li>Se recomienda usar letras, números y símbolos</li>
                <li>No uses información personal fácil de adivinar</li>
              </ul>
            </div>

            {passwordError && (
              <div className={styles.errorMessage}>
                ❌ {passwordError}
              </div>
            )}

            <div className={styles.formActions}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? '⏳ Actualizando...' : '💾 Cambiar Contraseña'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className={styles.twoFactorCard}>
          <h2 className={styles.sectionTitle}>Autenticación de Dos Factores (2FA)</h2>
          
          <div className={styles.twoFactorContainer}>
            <div className={styles.twoFactorInfo}>
              <h3>🔐 Protección Extra</h3>
              <p>
                La autenticación de dos factores agrega una capa adicional de seguridad 
                a tu cuenta, requiriendo un segundo paso de verificación al iniciar sesión.
              </p>
            </div>
            
            <Toggle
              label={twoFactorEnabled ? "2FA Activado" : "2FA Desactivado"}
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
              description={twoFactorEnabled ? "Tu cuenta está protegida" : "Activa para mayor seguridad"}
            />
          </div>

          {twoFactorEnabled && (
            <div className={styles.twoFactorActiveInfo}>
              ✅ La autenticación de dos factores está activa. Tu cuenta tiene protección adicional.
            </div>
          )}
        </Card>
      </div>

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

export default ConfigSeguridad;
