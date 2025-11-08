/**
 * sessionManager.js
 * Gestor centralizado de sesiones de usuario
 * Maneja: autenticación, almacenamiento seguro y validación de sesiones
 */

const SessionManager = (() => {
    // Constantes
    const SESSION_STORAGE_KEY = 'finaizen_session';
    const BACKUP_SESSION_KEY = 'finaizen_backup_session'; // Para sincronizar entre pestañas
    const LOCAL_STORAGE_KEY = 'finaizen_remembered_user';
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos
    const BASE_URL = window.location.origin; // URL base del sitio
    
    // Estado interno
    let sessionTimeout;
    let isSessionActive = false;

    /**
     * Obtiene la sesión actual del almacenamiento
     */
    const getSession = () => {
        try {
            const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error al obtener sesión:', error);
            return null;
        }
    };

    /**
     * Crea una nueva sesión
     */
    const createSession = (userData) => {
        try {
            const session = {
                user: {
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    id: userData.id || userData.email
                },
                createdAt: new Date().getTime(),
                lastActivity: new Date().getTime(),
                isActive: true
            };

            const sessionJSON = JSON.stringify(session);
            sessionStorage.setItem(SESSION_STORAGE_KEY, sessionJSON);
            // 📦 Guardar también en localStorage para sincronizar entre pestañas
            localStorage.setItem(BACKUP_SESSION_KEY, sessionJSON);
            isSessionActive = true;
            startSessionMonitoring();
            console.log('Sesión creada exitosamente');
            return session;
        } catch (error) {
            console.error('Error al crear sesión:', error);
            return null;
        }
    };

    /**
     * Obtiene los datos del usuario actual
     */
    const getCurrentUser = () => {
        const session = getSession();
        return session ? session.user : null;
    };

    /**
     * Obtiene el rol del usuario actual
     */
    const getUserRole = () => {
        const user = getCurrentUser();
        return user ? user.role : null;
    };

    /**
     * Verifica si el usuario está autenticado
     */
    const isAuthenticated = () => {
        const session = getSession();
        if (!session || !session.isActive) {
            return false;
        }
        
        // Verificar si la sesión ha expirado
        const now = new Date().getTime();
        const sessionAge = now - session.createdAt;
        
        if (sessionAge > SESSION_TIMEOUT) {
            clearSession();
            return false;
        }
        
        return true;
    };

    /**
     * Valida acceso según el rol
     */
    const hasRole = (requiredRoles) => {
        const userRole = getUserRole();
        if (!userRole) return false;
        
        const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        return rolesArray.includes(userRole);
    };

    /**
     * Actualiza la última actividad del usuario
     */
    const updateLastActivity = () => {
        try {
            const session = getSession();
            if (session) {
                session.lastActivity = new Date().getTime();
                const sessionJSON = JSON.stringify(session);
                sessionStorage.setItem(SESSION_STORAGE_KEY, sessionJSON);
                localStorage.setItem(BACKUP_SESSION_KEY, sessionJSON); // 📦 Sincronizar con localStorage
            }
        } catch (error) {
            console.error('Error al actualizar actividad:', error);
        }
    };

    /**
     * Inicia el monitoreo de sesión
     */
    const startSessionMonitoring = () => {
        // Limpiar timeout anterior si existe
        if (sessionTimeout) {
            clearTimeout(sessionTimeout);
        }

        // Configurar timeout de sesión
        sessionTimeout = setTimeout(() => {
            if (isAuthenticated()) {
                console.warn('Sesión expirada por inactividad');
                clearSession();
                redirectToLogin('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
        }, SESSION_TIMEOUT);

        // Resetear timeout en cada actividad del usuario
        document.addEventListener('mousemove', resetSessionTimeout);
        document.addEventListener('keypress', resetSessionTimeout);
        document.addEventListener('click', resetSessionTimeout);
    };

    /**
     * Resetea el timeout de sesión
     */
    const resetSessionTimeout = () => {
        if (isSessionActive) {
            updateLastActivity();
            
            if (sessionTimeout) {
                clearTimeout(sessionTimeout);
            }
            
            sessionTimeout = setTimeout(() => {
                if (isAuthenticated()) {
                    console.warn('Sesión expirada por inactividad');
                    clearSession();
                    redirectToLogin('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                }
            }, SESSION_TIMEOUT);
        }
    };

    /**
     * Limpia la sesión actual
     */
    const clearSession = () => {
        try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            localStorage.removeItem(BACKUP_SESSION_KEY); // 📦 También limpiar backup
            isSessionActive = false;
            
            if (sessionTimeout) {
                clearTimeout(sessionTimeout);
            }
            
            // Remover event listeners
            document.removeEventListener('mousemove', resetSessionTimeout);
            document.removeEventListener('keypress', resetSessionTimeout);
            document.removeEventListener('click', resetSessionTimeout);
            
            console.log('Sesión eliminada');
        } catch (error) {
            console.error('Error al limpiar sesión:', error);
        }
    };

    /**
     * Cierra sesión completamente
     */
    const logout = () => {
        clearSession();
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        console.log('Usuario desconectado');
    };

    /**
     * Guarda un usuario para recordarlo
     */
    const rememberUser = (userData) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                email: userData.email,
                name: userData.name,
                role: userData.role
            }));
        } catch (error) {
            console.error('Error al recordar usuario:', error);
        }
    };

    /**
     * Obtiene el usuario recordado
     */
    const getRememberedUser = () => {
        try {
            const remembered = localStorage.getItem(LOCAL_STORAGE_KEY);
            return remembered ? JSON.parse(remembered) : null;
        } catch (error) {
            console.error('Error al obtener usuario recordado:', error);
            return null;
        }
    };

    /**
     * Redirige a login
     */
    const redirectToLogin = (message = null) => {
        if (message) {
            console.warn(`${message}`);
        }
        window.location.href = `${BASE_URL}/Finaizen/src/pages/Base/login.html`;
    };

    /**
     * Redirige a index si el usuario ya está autenticado
     */
    const redirectIfAuthenticated = () => {
        if (isAuthenticated()) {
            const userRole = getUserRole();
            if (userRole === 'admin') {
                window.location.href = `${BASE_URL}/Finaizen/src/pages/Admin/dashboard.html`;
            } else {
                window.location.href = `${BASE_URL}/Finaizen/src/pages/User/dashboard.html`;
            }
        }
    };

    /**
     * Verifica autenticación al cargar una página protegida
     */
    const checkAuthOnPageLoad = () => {
        if (!isAuthenticated()) {
            console.warn('Acceso no autorizado - Redirigiendo a login');
            redirectToLogin('Por favor, inicia sesión para acceder a esta página.');
        }
    };

    /**
     * Retorna la interfaz pública
     */
    return {
        // Métodos de autenticación
        createSession,
        getSession,
        getCurrentUser,
        getUserRole,
        isAuthenticated,
        hasRole,
        
        // Métodos de gestión de sesión
        updateLastActivity,
        clearSession,
        logout,
        
        // Métodos de recordar usuario
        rememberUser,
        getRememberedUser,
        
        // Métodos de redirección
        redirectToLogin,
        redirectIfAuthenticated,
        checkAuthOnPageLoad,
        
        // Métodos de monitoreo
        startSessionMonitoring,
        resetSessionTimeout
    };
})();

// ⚡ VERIFICACIÓN INMEDIATA (Sincrónica - Sin esperar DOMContentLoaded)
// Esta verifica se ejecuta INMEDIATAMENTE antes de renderizar la página
(function() {
    // Solo ejecutar si el documento no está en estado "loading"
    // Esto asegura que se verifique antes de que se cargue cualquier contenido
    if (document.readyState === 'loading') {
        // Si el documento aún se está cargando, verificar inmediatamente
        const currentPath = window.location.pathname;
        const protectedRoutes = ['/Admin/', '/User/', 'Admin/', 'User/'];
        const isProtected = protectedRoutes.some(route => currentPath.includes(route));
        
        if (isProtected) {
            // Verificar autenticación INMEDIATAMENTE
            const session = sessionStorage.getItem('finaizen_session');
            if (!session) {
                // No hay sesión - Redirigir a login ANTES de renderizar
                window.location.href = window.location.origin + '/Finaizen/src/pages/Base/login.html';
            }
        }
    }
})();

// Verificación adicional en DOMContentLoaded como backup
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const protectedRoutes = ['/Admin/', '/User/', 'Admin/', 'User/'];
    const isProtected = protectedRoutes.some(route => currentPath.includes(route));
    
    if (isProtected) {
        SessionManager.checkAuthOnPageLoad();
    }
});
