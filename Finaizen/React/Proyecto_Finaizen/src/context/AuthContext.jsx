import { createContext, useContext, useState, useEffect } from 'react';
import mockDB, { EventTypes, EventCategories, SeverityLevels, EventStatus } from '../utils/mockDatabase';

/**
 * AuthContext - Contexto de Autenticación Global
 * Maneja el estado de autenticación en toda la aplicación
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Proveedor del contexto de autenticación
 * Envuelve la aplicación para proveer estado global de auth
 */
export const AuthProvider = ({ children }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPerfil, setCurrentPerfil] = useState(null);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadSession = () => {
      try {
        // Intentar cargar sesión desde localStorage
        const savedSession = localStorage.getItem('finaizen_session');
        if (savedSession) {
          const { userId, perfilId } = JSON.parse(savedSession);
          
          // Buscar usuario en mockDB
          const user = mockDB.users.find(u => u.id === userId);
          if (user) {
            mockDB.currentUser = user;
            setCurrentUser(user);

            // Cargar perfiles del usuario
            const userPerfiles = mockDB.getPerfilesDeUsuario(userId);
            setPerfiles(userPerfiles);

            // Buscar perfil activo
            const perfil = userPerfiles.find(p => p.id === perfilId) || userPerfiles[0];
            if (perfil) {
              mockDB.currentPerfil = perfil;
              setCurrentPerfil(perfil);
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem('finaizen_session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * Inicia sesión
   * @param {string} correoOUsername - Correo o nombre de usuario
   * @param {string} contraseña - Contraseña
   * @returns {Object} Resultado del login
   */
  const login = (correoOUsername, contraseña) => {
    // Verificar si el usuario está bloqueado
    const isBlocked = mockDB.isUserBlocked(correoOUsername);
    if (isBlocked) {
      return {
        success: false,
        message: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos. Intente más tarde.'
      };
    }

    const result = mockDB.login(correoOUsername, contraseña);
    
    // Registrar intento de login
    mockDB.trackLoginAttempt(correoOUsername, result.success);
    
    if (result.success) {
      setCurrentUser(result.user);
      setCurrentPerfil(result.perfil);
      
      // Cargar perfiles del usuario
      const userPerfiles = mockDB.getPerfilesDeUsuario(result.user.id);
      setPerfiles(userPerfiles);

      // Guardar sesión en localStorage
      localStorage.setItem('finaizen_session', JSON.stringify({
        userId: result.user.id,
        perfilId: result.perfil.id
      }));
    }
    
    return result;
  };

  /**
   * Cierra sesión
   */
  const logout = () => {
    // Registrar logout
    if (currentUser) {
      mockDB.createSecurityLog({
        userId: currentUser.id,
        userEmail: currentUser.email,
        eventType: EventTypes.LOGOUT,
        eventCategory: EventCategories.AUTENTICACION,
        description: 'Cierre de sesión',
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.LOW
      });
    }
    
    mockDB.logout();
    setCurrentUser(null);
    setCurrentPerfil(null);
    setPerfiles([]);
    localStorage.removeItem('finaizen_session');
  };

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Resultado del registro
   */
  const register = (userData) => {
    const result = mockDB.register(userData);
    
    if (result.success) {
      // Registrar evento de creación de cuenta
      mockDB.createSecurityLog({
        userId: result.user.id,
        userEmail: result.user.email,
        eventType: EventTypes.ACCOUNT_CREATED,
        eventCategory: EventCategories.ACCESO,
        description: 'Nueva cuenta creada',
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.MEDIUM,
        metadata: {
          userName: result.user.nombre,
          rol: result.user.rol
        }
      });

      // Registrar creación de perfil inicial
      mockDB.createSecurityLog({
        userId: result.user.id,
        userEmail: result.user.email,
        eventType: EventTypes.PERFIL_CREATED,
        eventCategory: EventCategories.CONFIGURACION,
        description: `Perfil financiero creado: ${result.perfil.nombre}`,
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.MEDIUM,
        metadata: {
          perfilId: result.perfil.id,
          perfilNombre: result.perfil.nombre,
          moneda: result.perfil.moneda
        }
      });

      setCurrentUser(result.user);
      setCurrentPerfil(result.perfil);
      setPerfiles([result.perfil]);

      // Guardar sesión
      localStorage.setItem('finaizen_session', JSON.stringify({
        userId: result.user.id,
        perfilId: result.perfil.id
      }));
    }
    
    return result;
  };

  /**
   * Cambia el perfil activo
   * @param {string} perfilId - ID del perfil
   */
  const cambiarPerfil = (perfilId) => {
    const perfil = perfiles.find(p => p.id === perfilId);
    if (perfil && currentUser) {
      mockDB.currentPerfil = perfil;
      setCurrentPerfil(perfil);

      // Registrar cambio de perfil
      mockDB.createSecurityLog({
        userId: currentUser.id,
        userEmail: currentUser.email,
        eventType: EventTypes.PERFIL_SWITCHED,
        eventCategory: EventCategories.CONFIGURACION,
        description: `Cambio a perfil: ${perfil.nombre}`,
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.LOW,
        metadata: {
          perfilId: perfil.id,
          perfilNombre: perfil.nombre
        }
      });

      // Actualizar sesión guardada
      const session = JSON.parse(localStorage.getItem('finaizen_session') || '{}');
      session.perfilId = perfilId;
      localStorage.setItem('finaizen_session', JSON.stringify(session));
    }
  };

  /**
   * Actualiza la información del usuario actual
   * @param {Object} updatedUser - Datos actualizados del usuario
   */
  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    mockDB.currentUser = updatedUser;
    
    // Actualizar sesión guardada
    const session = JSON.parse(localStorage.getItem('finaizen_session') || '{}');
    session.userId = updatedUser.id;
    localStorage.setItem('finaizen_session', JSON.stringify(session));
  };

  /**
   * Actualiza la lista de perfiles (útil después de crear uno nuevo)
   */
  const actualizarPerfiles = () => {
    if (currentUser) {
      const userPerfiles = mockDB.getPerfilesDeUsuario(currentUser.id);
      setPerfiles(userPerfiles);
    }
  };

  // Valor del contexto
  const value = {
    // Estado
    currentUser,
    currentPerfil,
    perfiles,
    loading,
    
    // Computed
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.esAdmin || false,
    
    // Métodos
    login,
    logout,
    register,
    cambiarPerfil,
    updateUser,
    actualizarPerfiles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
