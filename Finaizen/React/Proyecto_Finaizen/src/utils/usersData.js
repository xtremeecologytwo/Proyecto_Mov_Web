/**
 * usersData.js
 * Datos mock para gestión de usuarios
 */

export const ROLES = {
  'usuario': 'Usuario',
  'admin': 'Admin TI',
  'analista': 'Analista de Datos',
  'supervisor': 'Supervisor IA',
  'soporte': 'Agente de Soporte'
};

export const usersData = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    email: 'carlos.m@email.com',
    date: '2024-08-15',
    status: 'activo',
    role: 'usuario'
  },
  {
    id: 2,
    name: 'Ana Torres',
    email: 'ana.t@email.com',
    date: '2024-09-22',
    status: 'activo',
    role: 'analista'
  },
  {
    id: 3,
    name: 'Luis García',
    email: 'luis.g@email.com',
    date: '2024-07-10',
    status: 'activo',
    role: 'usuario'
  },
  {
    id: 4,
    name: 'Javier López',
    email: 'javier.l@email.com',
    date: '2024-08-30',
    status: 'suspendido',
    role: 'usuario'
  },
  {
    id: 5,
    name: 'Carmen Ruiz',
    email: 'carmen.r@email.com',
    date: '2024-09-15',
    status: 'activo',
    role: 'supervisor'
  },
  {
    id: 6,
    name: 'Elena Morales',
    email: 'elena.m@email.com',
    date: '2024-08-18',
    status: 'activo',
    role: 'soporte'
  },
  {
    id: 7,
    name: 'Isabel Díaz',
    email: 'isabel.d@email.com',
    date: '2024-08-25',
    status: 'suspendido',
    role: 'usuario'
  }
];
