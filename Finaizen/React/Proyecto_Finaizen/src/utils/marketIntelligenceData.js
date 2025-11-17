/**
 * marketIntelligenceData.js
 * Datos mock para Inteligencia de Mercado
 */

export const mockMarketDatabase = {
  quito: {
    "18-25": {
      expenses: [35000, 28000, 22000, 18000, 15000],
      incomeSources: [600, 150, 50, 200],
      trends: { 
        income: [800, 850, 900, 880, 920, 950], 
        expenses: [700, 720, 750, 800, 780, 810] 
      }
    },
    "26-35": {
      expenses: [42000, 31000, 25000, 20000, 17000],
      incomeSources: [1500, 400, 0, 300],
      trends: { 
        income: [2200, 2250, 2300, 2350, 2400, 2450], 
        expenses: [1800, 1900, 1850, 2000, 2100, 2050] 
      }
    },
    "36-50": {
      expenses: [55000, 25000, 28000, 22000, 19000],
      incomeSources: [2500, 800, 0, 500],
      trends: { 
        income: [3800, 3850, 3900, 4000, 4100, 4050], 
        expenses: [3000, 3100, 3200, 3150, 3300, 3400] 
      }
    }
  },
  guayaquil: {
    "18-25": {
      expenses: [38000, 26000, 24000, 20000, 13000],
      incomeSources: [650, 120, 80, 150],
      trends: { 
        income: [850, 880, 910, 900, 940, 980], 
        expenses: [750, 780, 790, 820, 800, 850] 
      }
    },
    "26-35": {
      expenses: [45000, 33000, 22000, 18000, 16000],
      incomeSources: [1600, 350, 0, 350],
      trends: { 
        income: [2300, 2350, 2400, 2450, 2500, 2550], 
        expenses: [1900, 1950, 2000, 2100, 2150, 2200] 
      }
    },
    "36-50": {
      expenses: [58000, 22000, 26000, 25000, 21000],
      incomeSources: [2800, 700, 0, 600],
      trends: { 
        income: [4100, 4200, 4150, 4300, 4400, 4350], 
        expenses: [3200, 3300, 3400, 3350, 3500, 3600] 
      }
    }
  }
};

export const expenseLabels = ['Restaurantes', 'Suscripciones', 'Transporte', 'Ocio', 'Ropa'];
export const incomeLabels = ['Sueldo', 'Emprendimiento', 'Becas', 'Otros'];
export const trendLabels = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];

export const ageOptions = [
  { value: '18-25', label: '18-25 años' },
  { value: '26-35', label: '26-35 años' },
  { value: '36-50', label: '36-50 años' }
];

export const locationOptions = [
  { value: 'quito', label: 'Quito' },
  { value: 'guayaquil', label: 'Guayaquil' }
];
