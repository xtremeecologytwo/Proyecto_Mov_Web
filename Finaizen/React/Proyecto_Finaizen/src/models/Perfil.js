/**
 * Modelo de Perfil Financiero
 * Un usuario puede tener múltiples perfiles (personal, empresa, proyecto, etc.)
 */
class Perfil {
  constructor({
    id,
    userId,
    nombre,
    moneda = 'USD',
    simboloMoneda = '$',
    createdAt = new Date(),
    ingresos = [],
    egresos = [],
    transacciones = [],
    presupuestos = [],
    logros = [],
    configuracion = {}
  }) {
    this.id = id;
    this.userId = userId; // ID del usuario dueño
    this.nombre = nombre;
    this.moneda = moneda;
    this.simboloMoneda = simboloMoneda;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.ingresos = ingresos; // Array de IDs de ingresos recurrentes
    this.egresos = egresos; // Array de IDs de egresos recurrentes
    this.transacciones = transacciones; // Array de IDs de transacciones (historial)
    this.presupuestos = presupuestos; // Array de IDs de presupuestos
    this.logros = logros; // Array de IDs de logros
    this.configuracion = configuracion; // Configuraciones del perfil
  }

  /**
   * Obtiene el saldo total del perfil
   */
  get saldoTotal() {
    // Esto se calcularía sumando todos los ingresos y restando egresos
    // desde el inicio hasta hoy
    return 0; // Placeholder
  }

  /**
   * Obtiene el ahorro mensual (ingreso - egreso del mes actual)
   */
  get ahorroMensual() {
    return 0; // Placeholder
  }

  /**
   * Agrega un ingreso al perfil
   */
  agregarIngreso(ingresoId) {
    if (!this.ingresos.includes(ingresoId)) {
      this.ingresos.push(ingresoId);
    }
  }

  /**
   * Agrega un egreso al perfil
   */
  agregarEgreso(egresoId) {
    if (!this.egresos.includes(egresoId)) {
      this.egresos.push(egresoId);
    }
  }

  /**
   * Agrega una transacción al historial del perfil
   */
  agregarTransaccion(transaccionId) {
    if (!this.transacciones.includes(transaccionId)) {
      this.transacciones.push(transaccionId);
    }
  }

  /**
   * Agrega un presupuesto al perfil
   */
  agregarPresupuesto(presupuestoId) {
    if (!this.presupuestos.includes(presupuestoId)) {
      this.presupuestos.push(presupuestoId);
    }
  }

  /**
   * Agrega un logro al perfil
   */
  agregarLogro(logroId) {
    if (!this.logros.includes(logroId)) {
      this.logros.push(logroId);
    }
  }

  /**
   * Elimina un ingreso del perfil
   */
  eliminarIngreso(ingresoId) {
    const index = this.ingresos.indexOf(ingresoId);
    if (index > -1) {
      this.ingresos.splice(index, 1);
    }
  }

  /**
   * Elimina un egreso del perfil
   */
  eliminarEgreso(egresoId) {
    const index = this.egresos.indexOf(egresoId);
    if (index > -1) {
      this.egresos.splice(index, 1);
    }
  }

  /**
   * Elimina un presupuesto del perfil
   */
  eliminarPresupuesto(presupuestoId) {
    const index = this.presupuestos.indexOf(presupuestoId);
    if (index > -1) {
      this.presupuestos.splice(index, 1);
    }
  }

  /**
   * Serializa el perfil
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      nombre: this.nombre,
      moneda: this.moneda,
      simboloMoneda: this.simboloMoneda,
      createdAt: this.createdAt.toISOString(),
      ingresos: this.ingresos,
      egresos: this.egresos,
      transacciones: this.transacciones,
      presupuestos: this.presupuestos,
      logros: this.logros,
      configuracion: this.configuracion
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new Perfil({
      ...json,
      createdAt: new Date(json.createdAt)
    });
  }
}

/**
 * Configuración de monedas por país
 */
export const MONEDAS_POR_PAIS = {
  'Ecuador': { moneda: 'USD', simbolo: '$', nombre: 'Dólar estadounidense' },
  'Estados Unidos': { moneda: 'USD', simbolo: '$', nombre: 'Dólar estadounidense' },
  'México': { moneda: 'MXN', simbolo: '$', nombre: 'Peso mexicano' },
  'Colombia': { moneda: 'COP', simbolo: '$', nombre: 'Peso colombiano' },
  'Perú': { moneda: 'PEN', simbolo: 'S/', nombre: 'Sol peruano' },
  'Argentina': { moneda: 'ARS', simbolo: '$', nombre: 'Peso argentino' },
  'Chile': { moneda: 'CLP', simbolo: '$', nombre: 'Peso chileno' },
  'Venezuela': { moneda: 'VES', simbolo: 'Bs.', nombre: 'Bolívar venezolano' },
  'España': { moneda: 'EUR', simbolo: '€', nombre: 'Euro' }
};

export default Perfil;
