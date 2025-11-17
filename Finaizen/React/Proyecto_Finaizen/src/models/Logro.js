/**
 * Modelo de Logro
 * Representa un logro desbloqueado por el usuario
 */
class Logro {
  constructor({
    id,
    perfilId,
    nombre,
    descripcion,
    icono = '🏆',
    tipo, // 'ahorro' | 'racha' | 'presupuesto' | 'registro' | 'especial'
    condicion, // Condición para desbloquear
    desbloqueado = false,
    fechaDesbloqueo = null,
    progreso = 0, // Progreso actual (0-100)
    meta = 100 // Meta para completar
  }) {
    this.id = id;
    this.perfilId = perfilId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.icono = icono;
    this.tipo = tipo;
    this.condicion = condicion;
    this.desbloqueado = desbloqueado;
    this.fechaDesbloqueo = fechaDesbloqueo ? new Date(fechaDesbloqueo) : null;
    this.progreso = progreso;
    this.meta = meta;
  }

  /**
   * Obtiene el porcentaje de progreso
   */
  get porcentajeProgreso() {
    return (this.progreso / this.meta) * 100;
  }

  /**
   * Actualiza el progreso del logro
   */
  actualizarProgreso(nuevoProgreso) {
    this.progreso = Math.min(nuevoProgreso, this.meta);
    
    // Desbloquear si se alcanzó la meta
    if (this.progreso >= this.meta && !this.desbloqueado) {
      this.desbloquear();
    }
  }

  /**
   * Desbloquea el logro
   */
  desbloquear() {
    this.desbloqueado = true;
    this.fechaDesbloqueo = new Date();
    this.progreso = this.meta;
  }

  /**
   * Serializa el logro
   */
  toJSON() {
    return {
      id: this.id,
      perfilId: this.perfilId,
      nombre: this.nombre,
      descripcion: this.descripcion,
      icono: this.icono,
      tipo: this.tipo,
      condicion: this.condicion,
      desbloqueado: this.desbloqueado,
      fechaDesbloqueo: this.fechaDesbloqueo ? this.fechaDesbloqueo.toISOString() : null,
      progreso: this.progreso,
      meta: this.meta
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new Logro({
      ...json,
      fechaDesbloqueo: json.fechaDesbloqueo ? new Date(json.fechaDesbloqueo) : null
    });
  }
}

/**
 * Logros predefinidos del sistema
 */
export const LOGROS_PREDEFINIDOS = [
  {
    id: 'logro_primer_ingreso',
    nombre: 'Primer Paso',
    descripcion: 'Registra tu primer ingreso',
    icono: '🎯',
    tipo: 'registro',
    condicion: 'primer_ingreso',
    meta: 1
  },
  {
    id: 'logro_primer_egreso',
    nombre: 'Consciente',
    descripcion: 'Registra tu primer egreso',
    icono: '📝',
    tipo: 'registro',
    condicion: 'primer_egreso',
    meta: 1
  },
  {
    id: 'logro_primer_presupuesto',
    nombre: 'Planificador',
    descripcion: 'Crea tu primer presupuesto',
    icono: '📊',
    tipo: 'presupuesto',
    condicion: 'primer_presupuesto',
    meta: 1
  },
  {
    id: 'logro_racha_7_dias',
    nombre: 'Constante',
    descripcion: 'Registra transacciones durante 7 días seguidos',
    icono: '🔥',
    tipo: 'racha',
    condicion: 'racha_dias',
    meta: 7
  },
  {
    id: 'logro_racha_30_dias',
    nombre: 'Disciplinado',
    descripcion: 'Registra transacciones durante 30 días seguidos',
    icono: '💪',
    tipo: 'racha',
    condicion: 'racha_dias',
    meta: 30
  },
  {
    id: 'logro_ahorro_100',
    nombre: 'Ahorrador Novato',
    descripcion: 'Ahorra $100 en un mes',
    icono: '💰',
    tipo: 'ahorro',
    condicion: 'ahorro_mensual',
    meta: 100
  },
  {
    id: 'logro_ahorro_500',
    nombre: 'Ahorrador Experto',
    descripcion: 'Ahorra $500 en un mes',
    icono: '💎',
    tipo: 'ahorro',
    condicion: 'ahorro_mensual',
    meta: 500
  },
  {
    id: 'logro_presupuesto_cumplido',
    nombre: 'Respetuoso del Límite',
    descripcion: 'Cumple todos tus presupuestos durante un mes',
    icono: '✅',
    tipo: 'presupuesto',
    condicion: 'presupuestos_cumplidos',
    meta: 1
  },
  {
    id: 'logro_50_registros',
    nombre: 'Detallista',
    descripcion: 'Registra 50 transacciones',
    icono: '📈',
    tipo: 'registro',
    condicion: 'total_registros',
    meta: 50
  },
  {
    id: 'logro_100_registros',
    nombre: 'Experto en Finanzas',
    descripcion: 'Registra 100 transacciones',
    icono: '🏆',
    tipo: 'registro',
    condicion: 'total_registros',
    meta: 100
  }
];

export default Logro;
