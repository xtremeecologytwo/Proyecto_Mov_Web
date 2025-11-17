/**
 * Modelo de Log de Seguridad
 * Registra eventos de autenticación, configuración y actividad del usuario
 */

/**
 * Genera un ID único para el log
 */
function generateLogId() {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Tipos de eventos de seguridad
 */
export const EventTypes = {
  // Autenticación
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_BLOCKED: 'LOGIN_BLOCKED',
  LOGOUT: 'LOGOUT',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  TWO_FACTOR_ENABLED: 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED: 'TWO_FACTOR_DISABLED',
  
  // Configuración
  EMAIL_CHANGE_REQUEST: 'EMAIL_CHANGE_REQUEST',
  EMAIL_CHANGED: 'EMAIL_CHANGED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_CHANGE_FAILED: 'PASSWORD_CHANGE_FAILED',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  PERFIL_CREATED: 'PERFIL_CREATED',
  PERFIL_DELETED: 'PERFIL_DELETED',
  PERFIL_SWITCHED: 'PERFIL_SWITCHED',
  NOTIFICATION_SETTINGS_CHANGED: 'NOTIFICATION_SETTINGS_CHANGED',
  PRIVACY_SETTINGS_CHANGED: 'PRIVACY_SETTINGS_CHANGED',
  
  // Datos
  DATA_EXPORT_REQUEST: 'DATA_EXPORT_REQUEST',
  DATA_EXPORT_COMPLETED: 'DATA_EXPORT_COMPLETED',
  DATA_DELETED: 'DATA_DELETED',
  
  // Acceso
  ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  
  // Sospechoso
  MULTIPLE_LOGIN_FAILURES: 'MULTIPLE_LOGIN_FAILURES',
  SUSPICIOUS_IP: 'SUSPICIOUS_IP',
  UNUSUAL_ACTIVITY: 'UNUSUAL_ACTIVITY'
};

/**
 * Categorías de eventos
 */
export const EventCategories = {
  AUTENTICACION: 'autenticacion',
  CONFIGURACION: 'configuracion',
  DATOS: 'datos',
  ACCESO: 'acceso',
  SOSPECHOSO: 'sospechoso'
};

/**
 * Niveles de severidad
 */
export const SeverityLevels = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Estados de evento
 */
export const EventStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  WARNING: 'warning'
};

/**
 * Descripciones legibles de eventos
 */
export const EventDescriptions = {
  [EventTypes.LOGIN_SUCCESS]: 'Inicio de sesión exitoso',
  [EventTypes.LOGIN_FAILURE]: 'Intento de inicio de sesión fallido',
  [EventTypes.LOGIN_BLOCKED]: 'Intento de acceso bloqueado',
  [EventTypes.LOGOUT]: 'Cierre de sesión',
  [EventTypes.SESSION_EXPIRED]: 'Sesión expirada',
  [EventTypes.PASSWORD_RESET_REQUEST]: 'Solicitud de reseteo de contraseña',
  [EventTypes.PASSWORD_RESET_SUCCESS]: 'Contraseña reseteada exitosamente',
  [EventTypes.TWO_FACTOR_ENABLED]: 'Autenticación 2FA activada',
  [EventTypes.TWO_FACTOR_DISABLED]: 'Autenticación 2FA desactivada',
  [EventTypes.EMAIL_CHANGE_REQUEST]: 'Solicitud de cambio de email',
  [EventTypes.EMAIL_CHANGED]: 'Email cambiado exitosamente',
  [EventTypes.PASSWORD_CHANGED]: 'Contraseña cambiada',
  [EventTypes.PASSWORD_CHANGE_FAILED]: 'Intento fallido de cambio de contraseña',
  [EventTypes.PROFILE_UPDATED]: 'Perfil de usuario actualizado',
  [EventTypes.PERFIL_CREATED]: 'Nuevo perfil financiero creado',
  [EventTypes.PERFIL_DELETED]: 'Perfil financiero eliminado',
  [EventTypes.PERFIL_SWITCHED]: 'Cambio entre perfiles',
  [EventTypes.NOTIFICATION_SETTINGS_CHANGED]: 'Configuración de notificaciones modificada',
  [EventTypes.PRIVACY_SETTINGS_CHANGED]: 'Configuración de privacidad modificada',
  [EventTypes.DATA_EXPORT_REQUEST]: 'Solicitud de exportación de datos',
  [EventTypes.DATA_EXPORT_COMPLETED]: 'Exportación completada',
  [EventTypes.DATA_DELETED]: 'Datos eliminados',
  [EventTypes.ACCOUNT_CREATED]: 'Nueva cuenta creada',
  [EventTypes.ACCOUNT_DELETED]: 'Cuenta eliminada',
  [EventTypes.ACCOUNT_SUSPENDED]: 'Cuenta suspendida',
  [EventTypes.MULTIPLE_LOGIN_FAILURES]: 'Múltiples intentos fallidos detectados',
  [EventTypes.SUSPICIOUS_IP]: 'Acceso desde IP sospechosa',
  [EventTypes.UNUSUAL_ACTIVITY]: 'Actividad inusual detectada'
};

/**
 * Clase SecurityLog
 * Representa un evento de seguridad en el sistema
 */
class SecurityLog {
  constructor({
    id,
    timestamp,
    userId,
    userEmail,
    eventType,
    eventCategory,
    description,
    ipAddress,
    userAgent,
    status,
    severity,
    metadata
  }) {
    this.id = id || generateLogId();
    this.timestamp = timestamp || new Date().toISOString();
    this.userId = userId || null;
    this.userEmail = userEmail;
    this.eventType = eventType;
    this.eventCategory = eventCategory;
    this.description = description || EventDescriptions[eventType] || 'Evento de seguridad';
    this.ipAddress = ipAddress || this.getSimulatedIP();
    this.userAgent = userAgent || this.getSimulatedUserAgent();
    this.status = status;
    this.severity = severity;
    this.metadata = metadata || {};
  }

  /**
   * Simula una IP (en producción vendría del servidor)
   */
  getSimulatedIP() {
    return `192.168.1.${Math.floor(Math.random() * 255)}`;
  }

  /**
   * Obtiene user agent del navegador
   */
  getSimulatedUserAgent() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'Unknown';
  }

  /**
   * Convierte el log a objeto plano para JSON
   */
  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      userId: this.userId,
      userEmail: this.userEmail,
      eventType: this.eventType,
      eventCategory: this.eventCategory,
      description: this.description,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      status: this.status,
      severity: this.severity,
      metadata: this.metadata
    };
  }

  /**
   * Crea un SecurityLog desde JSON
   */
  static fromJSON(json) {
    return new SecurityLog(json);
  }
}

export default SecurityLog;
