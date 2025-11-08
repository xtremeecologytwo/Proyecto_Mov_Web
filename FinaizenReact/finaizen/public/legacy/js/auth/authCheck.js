/**
 * authCheck.js
 * ⚡ Verificación INMEDIATA de autenticación
 * Se debe cargar en el <head> ANTES de cualquier contenido
 * Previene que se vea el contenido protegido aunque sea un instante
 * 
 * MEJORADO: Usa sessionStorage + localStorage para sincronizar entre pestañas
 */

(function() {
    'use strict';
    
    // Rutas protegidas
    const PROTECTED_ROUTES = ['/Admin/', '/User/', 'Admin/', 'User/'];
    const SESSION_KEY = 'finaizen_session';
    const BACKUP_SESSION_KEY = 'finaizen_backup_session'; // Fallback en localStorage
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
    const BASE_URL = window.location.origin;
    
    /**
     * Obtiene la sesión desde sessionStorage o localStorage
     */
    function getSession() {
        // Primero intentar sessionStorage
        let session = sessionStorage.getItem(SESSION_KEY);
        
        // Si no existe en sessionStorage, intentar localStorage como fallback
        if (!session) {
            session = localStorage.getItem(BACKUP_SESSION_KEY);
            if (session) {
                // Si existe en localStorage, restaurarla en sessionStorage
                sessionStorage.setItem(SESSION_KEY, session);
                console.log('📦 Sesión restaurada desde localStorage');
            }
        }
        
        return session;
    }
    
    /**
     * Valida y actualiza la sesión
     */
    function validateAndRefreshSession() {
        const currentPath = window.location.pathname;
        const isProtected = PROTECTED_ROUTES.some(route => currentPath.includes(route));
        
        if (!isProtected) {
            return; // No es ruta protegida, no hacer nada
        }
        
        try {
            let session = getSession();
            
            if (!session) {
                // ❌ NO AUTENTICADO
                console.warn('🔐 Acceso denegado - Usuario no autenticado');
                console.log('📌 sessionStorage:', sessionStorage.getItem(SESSION_KEY));
                console.log('📌 localStorage:', localStorage.getItem(BACKUP_SESSION_KEY));
                redirectToLogin();
                return;
            }
            
            const sessionData = JSON.parse(session);
            
            // Validar estructura básica
            if (!sessionData.user || !sessionData.user.role || !sessionData.isActive) {
                console.warn('Sesión corrupta - Redirigiendo a login');
                sessionStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(BACKUP_SESSION_KEY);
                redirectToLogin();
                return;
            }
            
            // ✅ VALIDAR EXPIRACIÓN considerando ÚLTIMA ACTIVIDAD
            const now = new Date().getTime();
            const lastActivity = sessionData.lastActivity || sessionData.createdAt;
            const inactivityTime = now - lastActivity;
            
            if (inactivityTime > SESSION_TIMEOUT) {
                console.warn('⏰ Sesión expirada por inactividad - Redirigiendo a login');
                sessionStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(BACKUP_SESSION_KEY);
                redirectToLogin();
                return;
            }
            
            // ✅ AUTENTICADO Y VÁLIDO
            // Actualizar lastActivity para mantener sesión activa
            sessionData.lastActivity = now;
            const updatedSession = JSON.stringify(sessionData);
            sessionStorage.setItem(SESSION_KEY, updatedSession);
            localStorage.setItem(BACKUP_SESSION_KEY, updatedSession); // Sincronizar con localStorage
            
            console.log('✅ Acceso permitido - Usuario autenticado como:', sessionData.user.role);
            
        } catch (error) {
            console.error('Error al validar sesión:', error);
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(BACKUP_SESSION_KEY);
            redirectToLogin();
        }
    }
    
    /**
     * Redirige a login bloqueando renderización
     */
    function redirectToLogin() {
        alert('Usuario no logeado, redireccionando a login');
        document.documentElement.innerHTML = '';
        window.location.replace(BASE_URL + '/Finaizen/src/pages/Base/login.html');
    }
    
    // Validar sesión inmediatamente
    validateAndRefreshSession();
    
    // También validar cuando el usuario interactúa (click, input, etc)
    // Esto ayuda a sincronizar entre pestañas
    document.addEventListener('click', validateAndRefreshSession, true);
    document.addEventListener('input', validateAndRefreshSession, true);
    
    // Escuchar cambios de storage desde otras pestañas
    window.addEventListener('storage', function(event) {
        if (event.key === BACKUP_SESSION_KEY || event.key === SESSION_KEY) {
            validateAndRefreshSession();
        }
    });
    
})();
