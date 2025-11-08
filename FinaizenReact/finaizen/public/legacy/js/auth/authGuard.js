/**
 * authGuard.js
 * Sistema de protección de rutas
 * Valida que los usuarios solo accedan a las páginas según su autenticación y rol
 */

const AuthGuard = (() => {
    /**
     * Valida que el usuario esté autenticado
     * Si no lo está, lo redirige a login
     */
    const requireAuth = () => {
        if (!SessionManager.isAuthenticated()) {
            console.warn('Acceso denegado: Usuario no autenticado');
            SessionManager.redirectToLogin('Debes iniciar sesión para acceder a esta página.');
            return false;
        }
        return true;
    };

    /**
     * Valida que el usuario tenga un rol específico
     */
    const requireRole = (roles) => {
        if (!SessionManager.isAuthenticated()) {
            console.warn('🔐 Acceso denegado: Usuario no autenticado');
            SessionManager.redirectToLogin('Debes iniciar sesión para acceder a esta página.');
            return false;
        }

        if (!SessionManager.hasRole(roles)) {
            console.error('Acceso denegado: Rol insuficiente');
            alert('❌ No tienes permisos para acceder a esta página.');
            history.back();
            return false;
        }

        return true;
    };

    /**
     * Valida que el usuario sea administrador
     */
    const requireAdmin = () => {
        return requireRole('admin');
    };

    /**
     * Valida que el usuario sea usuario normal
     */
    const requireUser = () => {
        return requireRole('user');
    };

    /**
     * Protege una página entera
     */
    const protectPage = (requiredRoles = null) => {
        if (requiredRoles) {
            return requireRole(requiredRoles);
        } else {
            return requireAuth();
        }
    };

    /**
     * Valida acceso a un elemento específico
     */
    const canAccessElement = (roles) => {
        if (!SessionManager.isAuthenticated()) {
            return false;
        }
        if (roles && !SessionManager.hasRole(roles)) {
            return false;
        }
        return true;
    };

    /**
     * Oculta elementos basados en el rol
     */
    const hideElementsByRole = (roleRestrictions) => {
        // roleRestrictions: { '.admin-only': 'admin', '.user-only': 'user' }
        Object.keys(roleRestrictions).forEach(selector => {
            const requiredRole = roleRestrictions[selector];
            const elements = document.querySelectorAll(selector);
            
            if (!SessionManager.hasRole(requiredRole)) {
                elements.forEach(el => el.style.display = 'none');
            }
        });
    };

    /**
     * Muestra/oculta elementos basados en autenticación
     */
    const toggleAuthElements = () => {
        const isAuth = SessionManager.isAuthenticated();
        
        // Mostrar elementos para usuarios autenticados
        document.querySelectorAll('[data-auth-show]').forEach(el => {
            el.style.display = isAuth ? '' : 'none';
        });
        
        // Ocultar elementos para usuarios autenticados
        document.querySelectorAll('[data-auth-hide]').forEach(el => {
            el.style.display = isAuth ? 'none' : '';
        });
    };

    /**
     * Retorna información formateada del usuario para debug
     */
    const getUserInfo = () => {
        const user = SessionManager.getCurrentUser();
        if (!user) {
            return null;
        }
        return {
            email: user.email,
            name: user.name,
            role: user.role,
            isAuthenticated: SessionManager.isAuthenticated()
        };
    };

    /**
     * Retorna la interfaz pública
     */
    return {
        requireAuth,
        requireRole,
        requireAdmin,
        requireUser,
        protectPage,
        canAccessElement,
        hideElementsByRole,
        toggleAuthElements,
        getUserInfo
    };
})();

// Inicializar guardias al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    AuthGuard.toggleAuthElements();
});
