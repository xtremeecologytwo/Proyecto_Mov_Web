/**
 * Modelo de Egreso
 * Representa un gasto recurrente o único
 */
class Egreso {
  constructor({
    id,
    perfilId,
    monto,
    descripcion,
    categoria = 'Otros', // Será clasificado automáticamente o manualmente
    clasificacionIA = null, // Clasificación sugerida por IA
    frecuencia = 'ocasional',
    diasSemana = [],
    diaMes = null,
    fechaEspecifica = null,
    delay = '00:00', // Hora del día para ejecutar (HH:mm)
    notificacionActiva = false,
    activo = true,
    proximaEjecucion = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.perfilId = perfilId;
    this.monto = parseFloat(monto);
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.clasificacionIA = clasificacionIA;
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
   * Calcula la próxima fecha de ejecución (igual que Ingreso)
   */
  calcularProximaEjecucion() {
    const ahora = new Date();
    let proxima = new Date(ahora);

    switch (this.frecuencia) {
      case 'diario':
        proxima.setDate(proxima.getDate() + 1);
        break;
      
      case 'semanal':
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
          if (proxima <= ahora) {
            proxima.setMonth(proxima.getMonth() + 1);
          }
        }
        break;
      
      case 'anual':
        if (this.fechaEspecifica) {
          proxima = new Date(this.fechaEspecifica);
          proxima.setFullYear(ahora.getFullYear());
          if (proxima <= ahora) {
            proxima.setFullYear(proxima.getFullYear() + 1);
          }
        }
        break;
      
      case 'ocasional':
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
   * Verifica si el egreso debe ejecutarse ahora
   */
  debeEjecutarse() {
    if (!this.activo) return false;
    if (!this.proximaEjecucion) return false;
    
    const ahora = new Date();
    return this.proximaEjecucion <= ahora;
  }

  /**
   * Marca el egreso como ejecutado
   */
  marcarComoEjecutado() {
    if (this.frecuencia === 'ocasional') {
      this.activo = false;
    }
    
    this.proximaEjecucion = this.calcularProximaEjecucion();
    this.updatedAt = new Date();
  }

  /**
   * Aplica clasificación automática con IA (simulado)
   */
  clasificarConIA() {
    const descripcionLower = this.descripcion.toLowerCase();
    
    // Simulación simple de clasificación por palabras clave
    const clasificaciones = {
      'Suscripciones': ['netflix', 'spotify', 'amazon', 'hbo', 'disney', 'youtube', 'premium'],
      'Comida': ['supermercado', 'restaurante', 'comida', 'cena', 'almuerzo', 'pizza', 'delivery'],
      'Transporte': ['uber', 'taxi', 'gasolina', 'combustible', 'bus', 'metro', 'estacionamiento'],
      'Servicios': ['luz', 'agua', 'internet', 'telefono', 'cable', 'gas'],
      'Salud': ['farmacia', 'doctor', 'medico', 'hospital', 'clinica', 'medicina'],
      'Educación': ['curso', 'universidad', 'colegio', 'libro', 'material'],
      'Entretenimiento': ['cine', 'concierto', 'teatro', 'juego', 'videojuego'],
      'Ropa': ['ropa', 'zapatos', 'tienda', 'mall'],
      'Hogar': ['mueble', 'decoracion', 'electrodomestico', 'reparacion']
    };

    for (const [categoria, palabras] of Object.entries(clasificaciones)) {
      if (palabras.some(palabra => descripcionLower.includes(palabra))) {
        this.clasificacionIA = categoria;
        return categoria;
      }
    }

    this.clasificacionIA = 'Otros';
    return 'Otros';
  }

  /**
   * Serializa el egreso
   */
  toJSON() {
    return {
      id: this.id,
      perfilId: this.perfilId,
      monto: this.monto,
      descripcion: this.descripcion,
      categoria: this.categoria,
      clasificacionIA: this.clasificacionIA,
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
    return new Egreso({
      ...json,
      fechaEspecifica: json.fechaEspecifica,
      proximaEjecucion: json.proximaEjecucion,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt)
    });
  }
}

/**
 * Categorías predefinidas de egresos
 */
export const CATEGORIAS_EGRESO = [
  'Comida',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Suscripciones',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Ropa',
  'Hogar',
  'Ahorro',
  'Inversión',
  'Deudas',
  'Otros'
];

export default Egreso;
