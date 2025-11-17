/**
 * Modelo de Presupuesto
 * Define límites de gasto por categoría
 */
class Presupuesto {
  constructor({
    id,
    perfilId,
    categoria,
    montoLimite,
    montoGastado = 0,
    periodo = 'mensual', // 'semanal' | 'mensual' | 'anual'
    alertaEn = 80, // Porcentaje para alertar (default: 80%)
    activo = true,
    mes = new Date().getMonth() + 1,
    anio = new Date().getFullYear(),
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.perfilId = perfilId;
    this.categoria = categoria;
    this.montoLimite = parseFloat(montoLimite);
    this.montoGastado = parseFloat(montoGastado);
    this.periodo = periodo;
    this.alertaEn = alertaEn;
    this.activo = activo;
    this.mes = mes;
    this.anio = anio;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  /**
   * Obtiene el porcentaje gastado
   */
  get porcentajeGastado() {
    if (this.montoLimite === 0) return 0;
    return (this.montoGastado / this.montoLimite) * 100;
  }

  /**
   * Obtiene el monto restante
   */
  get montoRestante() {
    return Math.max(0, this.montoLimite - this.montoGastado);
  }

  /**
   * Verifica si se excedió el presupuesto
   */
  get excedido() {
    return this.montoGastado > this.montoLimite;
  }

  /**
   * Obtiene el estado del presupuesto
   */
  get estado() {
    const porcentaje = this.porcentajeGastado;
    
    if (porcentaje >= 100) return 'danger'; // Excedido
    if (porcentaje >= this.alertaEn) return 'warning'; // Cerca del límite
    if (porcentaje >= 50) return 'neutral'; // Moderado
    return 'ok'; // Bajo control
  }

  /**
   * Obtiene el mensaje de alerta según el estado
   */
  get mensajeAlerta() {
    switch (this.estado) {
      case 'danger':
        return '¡Tomar medidas! Has excedido el presupuesto.';
      case 'warning':
        return '¡Cuidado! Estás llegando al límite.';
      case 'neutral':
        return 'Moderado. Mantén el control.';
      case 'ok':
        return 'Bajo control.';
      default:
        return '';
    }
  }

  /**
   * Agrega un gasto al presupuesto
   */
  agregarGasto(monto) {
    this.montoGastado += parseFloat(monto);
    this.updatedAt = new Date();
  }

  /**
   * Reinicia el presupuesto (para nuevo periodo)
   */
  reiniciar() {
    this.montoGastado = 0;
    
    switch (this.periodo) {
      case 'mensual':
        const ahora = new Date();
        this.mes = ahora.getMonth() + 1;
        this.anio = ahora.getFullYear();
        break;
      // Implementar lógica para otros periodos si es necesario
    }
    
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el presupuesto debe reiniciarse
   */
  debeReiniciarse() {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();

    if (this.periodo === 'mensual') {
      return this.mes !== mesActual || this.anio !== anioActual;
    }

    // Agregar lógica para otros periodos
    return false;
  }

  /**
   * Serializa el presupuesto
   */
  toJSON() {
    return {
      id: this.id,
      perfilId: this.perfilId,
      categoria: this.categoria,
      montoLimite: this.montoLimite,
      montoGastado: this.montoGastado,
      periodo: this.periodo,
      alertaEn: this.alertaEn,
      activo: this.activo,
      mes: this.mes,
      anio: this.anio,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new Presupuesto({
      ...json,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}

export default Presupuesto;
