/**
 * Modelo de Ingreso
 * Representa un ingreso recurrente o único
 */
class Ingreso {
  constructor({
    id,
    perfilId,
    monto,
    descripcion,
    categoria = 'Otros',
    frecuencia = 'ocasional', // 'diario' | 'semanal' | 'mensual' | 'anual' | 'ocasional'
    diasSemana = [], // Para frecuencia semanal: [0,1,2,3,4,5,6] (0=Domingo)
    diaMes = null, // Para frecuencia mensual: 1-31
    fechaEspecifica = null, // Para frecuencia anual o ocasional
    delay = '00:00', // Hora del día para ejecutar (HH:mm)
    notificacionActiva = false,
    activo = true,
    proximaEjecucion = null, // Fecha de la próxima ejecución
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.perfilId = perfilId;
    this.monto = parseFloat(monto);
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.frecuencia = frecuencia;
    this.diasSemana = diasSemana;
    this.diaMes = diaMes;
    this.fechaEspecifica = fechaEspecifica ? new Date(fechaEspecifica) : null;
    this.delay = delay;
    this.notificacionActiva = notificacionActiva;
    this.activo = activo;
    this.proximaEjecucion = proximaEjecucion ? new Date(proximaEjecucion) : this.calcularProximaEjecucion();
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  /**
   * Calcula la próxima fecha de ejecución basándose en la frecuencia
   */
  calcularProximaEjecucion() {
    const ahora = new Date();
    let proxima = new Date(ahora);

    switch (this.frecuencia) {
      case 'diario':
        proxima.setDate(proxima.getDate() + 1);
        break;
      
      case 'semanal':
        // Buscar el próximo día de la semana en la lista
        if (this.diasSemana.length > 0) {
          let encontrado = false;
          for (let i = 1; i <= 7 && !encontrado; i++) {
            const testDate = new Date(ahora);
            testDate.setDate(testDate.getDate() + i);
            if (this.diasSemana.includes(testDate.getDay())) {
              proxima = testDate;
              encontrado = true;
            }
          }
        }
        break;
      
      case 'mensual':
        if (this.diaMes) {
          proxima.setDate(this.diaMes);
          // Si ya pasó este mes, ir al siguiente
          if (proxima <= ahora) {
            proxima.setMonth(proxima.getMonth() + 1);
          }
        }
        break;
      
      case 'anual':
        if (this.fechaEspecifica) {
          proxima = new Date(this.fechaEspecifica);
          proxima.setFullYear(ahora.getFullYear());
          // Si ya pasó este año, ir al siguiente
          if (proxima <= ahora) {
            proxima.setFullYear(proxima.getFullYear() + 1);
          }
        }
        break;
      
      case 'ocasional':
        // Los ocasionales se ejecutan inmediatamente
        proxima = this.fechaEspecifica || ahora;
        break;
    }

    // Ajustar hora del día (delay)
    if (this.delay) {
      const [hora, minuto] = this.delay.split(':');
      proxima.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    }

    return proxima;
  }

  /**
   * Verifica si el ingreso debe ejecutarse ahora
   */
  debeEjecutarse() {
    if (!this.activo) return false;
    if (!this.proximaEjecucion) return false;
    
    const ahora = new Date();
    return this.proximaEjecucion <= ahora;
  }

  /**
   * Marca el ingreso como ejecutado y calcula la próxima ejecución
   */
  marcarComoEjecutado() {
    if (this.frecuencia === 'ocasional') {
      this.activo = false; // Los ocasionales se ejecutan una sola vez
    }
    
    this.proximaEjecucion = this.calcularProximaEjecucion();
    this.updatedAt = new Date();
  }

  /**
   * Serializa el ingreso
   */
  toJSON() {
    return {
      id: this.id,
      perfilId: this.perfilId,
      monto: this.monto,
      descripcion: this.descripcion,
      categoria: this.categoria,
      frecuencia: this.frecuencia,
      diasSemana: this.diasSemana,
      diaMes: this.diaMes,
      fechaEspecifica: this.fechaEspecifica ? this.fechaEspecifica.toISOString() : null,
      delay: this.delay,
      notificacionActiva: this.notificacionActiva,
      activo: this.activo,
      proximaEjecucion: this.proximaEjecucion ? this.proximaEjecucion.toISOString() : null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    return new Ingreso({
      ...json,
      fechaEspecifica: json.fechaEspecifica,
      proximaEjecucion: json.proximaEjecucion,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}

/**
 * Categorías predefinidas de ingresos
 */
export const CATEGORIAS_INGRESO = [
  'Salario',
  'Freelance',
  'Negocio',
  'Inversiones',
  'Alquiler',
  'Venta',
  'Regalo',
  'Reembolso',
  'Otros'
];

export default Ingreso;
