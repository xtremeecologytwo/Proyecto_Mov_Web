/**
 * supervisionData.js
 * Datos mock para supervisión de categorías IA
 */

export const transactionsData = [
  { id: 1, desc: 'Salida al cine', keyword: 'Cine', category: 'Entretenimiento', confidence: 'alta', score: 98, status: 'Validado' },
  { id: 2, desc: 'Comprar medicina', keyword: 'Medicina', category: 'Salud', confidence: 'media', score: 74, status: 'Corregir' },
  { id: 3, desc: 'Pago de suscripcion spotify', keyword: 'Pago', category: 'Otros', confidence: 'baja', score: 45, status: 'Corregir y crear regla' },
  { id: 4, desc: 'Uber a casa', keyword: 'Uber', category: 'Transporte', confidence: 'media', score: 68, status: 'Corregir' },
  { id: 5, desc: 'Supermaxi compra semanal', keyword: 'Supermaxi', category: 'Supermercado', confidence: 'alta', score: 99, status: 'Validado' },
  { id: 6, desc: 'Cuota del gym', keyword: 'Gym', category: 'Salud', confidence: 'alta', score: 92, status: 'Validado' },
  { id: 7, desc: 'Netflix mensual', keyword: 'Netflix', category: 'Otros', confidence: 'baja', score: 51, status: 'Corregir y crear regla' }
];

export const kpiData = {
  precision: 96.5,
  corrections: 82,
  problematicCategories: ['Suscripciones', 'Transporte']
};

export const chartData = {
  confidence: {
    labels: ['Alta', 'Media', 'Baja'],
    values: [4, 2, 1]
  },
  corrections: {
    labels: ['Jul', 'Ago', 'Sep', 'Oct'],
    values: [120, 95, 88, 82]
  }
};

export const categories = [
  'Entretenimiento',
  'Salud',
  'Transporte',
  'Supermercado',
  'Suscripciones',
  'Servicios',
  'Otros'
];
