/**
 * Modelo de Notificación
 * Representa notificaciones del sistema
 */
class Notificacion {
  constructor({
    id,
    userId,
    perfilId = null,
    tipo, // 'info' | 'warning' | 'success' | 'error' | 'logro' | 'presupuesto' | 'transaccion'
    titulo,
    mensaje,
    icono = '🔔',
    leida = false,
    accionUrl = null, // URL a la que redirigir al hacer click
    data = {}, // Datos adicionales
    createdAt = new Date()
  }) {
    this.id = id;
    this.userId = userId;
    this.perfilId = perfilId;
    this.tipo = tipo;
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.icono = icono;
    this.leida = leida;
    this.accionUrl = accionUrl;
    this.data = data;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  /**
   * Marca la notificación como leída
   */
  marcarComoLeida() {
    this.leida = true;
  }

  /**
   * Serializa la notificación
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      perfilId: this.perfilId,
      tipo: this.tipo,
      titulo: this.titulo,
      mensaje: this.mensaje,
      icono: this.icono,
      leida: this.leida,
      accionUrl: this.accionUrl,
      data: this.data,
      createdAt: this.createdAt.toISOString()
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new Notificacion({
      ...json,
      createdAt: new Date(json.createdAt)
    });
  }

  /**
   * Crea una notificación de logro desbloqueado
   */
  static crearNotificacionLogro(userId, perfilId, logro) {
    return new Notificacion({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      perfilId,
      tipo: 'logro',
      titulo: '🏆 ¡Nuevo Logro Desbloqueado!',
      mensaje: `Has desbloqueado "${logro.nombre}": ${logro.descripcion}`,
      icono: logro.icono,
      accionUrl: '/logros',
      data: { logroId: logro.id }
    });
  }

  /**
   * Crea una notificación de presupuesto
   */
  static crearNotificacionPresupuesto(userId, perfilId, presupuesto) {
    let tipo = 'info';
    let icono = '📊';
    
    if (presupuesto.estado === 'danger') {
      tipo = 'error';
      icono = '⚠️';
    } else if (presupuesto.estado === 'warning') {
      tipo = 'warning';
      icono = '🔔';
    }

    return new Notificacion({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      perfilId,
      tipo,
      titulo: `Presupuesto: ${presupuesto.categoria}`,
      mensaje: presupuesto.mensajeAlerta,
      icono,
      accionUrl: '/presupuestos',
      data: { presupuestoId: presupuesto.id }
    });
  }

  /**
   * Crea una notificación de transacción programada
   */
  static crearNotificacionTransaccion(userId, perfilId, transaccion, tipo) {
    return new Notificacion({
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      perfilId,
      tipo: 'transaccion',
      titulo: tipo === 'ingreso' ? '💰 Ingreso Programado' : '💸 Egreso Programado',
      mensaje: `Se ha registrado: ${transaccion.descripcion} - $${transaccion.monto}`,
      icono: tipo === 'ingreso' ? '💰' : '💸',
      accionUrl: '/historial',
      data: { transaccionId: transaccion.id, tipo }
    });
  }
}

export default Notificacion;
