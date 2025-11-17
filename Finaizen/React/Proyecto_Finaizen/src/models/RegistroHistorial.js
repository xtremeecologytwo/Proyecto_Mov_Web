/**
 * Modelo de Registro en Historial
 * Representa una transacción ya ejecutada (ingreso o egreso)
 */
class RegistroHistorial {
  constructor({
    id,
    perfilId,
    tipo, // 'ingreso' | 'egreso'
    monto,
    descripcion,
    categoria,
    transaccionOrigenId, // ID del ingreso o egreso que lo generó
    fechaEjecucion = new Date(),
    mes,
    anio
  }) {
    this.id = id;
    this.perfilId = perfilId;
    this.tipo = tipo;
    this.monto = parseFloat(monto);
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.transaccionOrigenId = transaccionOrigenId;
    this.fechaEjecucion = new Date(fechaEjecucion);
    this.mes = mes || this.fechaEjecucion.getMonth() + 1; // 1-12
    this.anio = anio || this.fechaEjecucion.getFullYear();
  }

  /**
   * Verifica si el registro es de un ingreso
   */
  get esIngreso() {
    return this.tipo === 'ingreso';
  }

  /**
   * Verifica si el registro es de un egreso
   */
  get esEgreso() {
    return this.tipo === 'egreso';
  }

  /**
   * Obtiene el monto con signo
   */
  get montoConSigno() {
    return this.esIngreso ? this.monto : -this.monto;
  }

  /**
   * Serializa el registro
   */
  toJSON() {
    return {
      id: this.id,
      perfilId: this.perfilId,
      tipo: this.tipo,
      monto: this.monto,
      descripcion: this.descripcion,
      categoria: this.categoria,
      transaccionOrigenId: this.transaccionOrigenId,
      fechaEjecucion: this.fechaEjecucion.toISOString(),
      mes: this.mes,
      anio: this.anio
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new RegistroHistorial({
      ...json,
      fechaEjecucion: new Date(json.fechaEjecucion)
    });
  }

  /**
   * Crea un registro desde un Ingreso
   */
  static fromIngreso(ingreso, perfilId) {
    return new RegistroHistorial({
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      perfilId: perfilId,
      tipo: 'ingreso',
      monto: ingreso.monto,
      descripcion: ingreso.descripcion,
      categoria: ingreso.categoria,
      transaccionOrigenId: ingreso.id,
      fechaEjecucion: new Date()
    });
  }

  /**
   * Crea un registro desde un Egreso
   */
  static fromEgreso(egreso, perfilId) {
    return new RegistroHistorial({
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      perfilId: perfilId,
      tipo: 'egreso',
      monto: egreso.monto,
      descripcion: egreso.descripcion,
      categoria: egreso.categoria,
      transaccionOrigenId: egreso.id,
      fechaEjecucion: new Date()
    });
  }
}

export default RegistroHistorial;
