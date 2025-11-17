export const securityLogs = [
  { id: 1, datetime: '2025-10-18 14:22:18', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.105', user: 'carlos.mendez@email.com', blocked: false },
  { id: 2, datetime: '2025-10-18 13:58:01', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.107', user: 'laura.gomez@email.com', blocked: true },
  { id: 3, datetime: '2025-10-18 12:31:47', type: 'exitoso', event: 'Inicio de Sesión', ip: '192.168.1.109', user: 'david.garcia@email.com', blocked: false },
  { id: 4, datetime: '2025-10-18 12:05:33', type: 'modificacion', event: 'Cambio de Contraseña', ip: '192.168.1.118', user: 'isabel.sanchez@email.com', blocked: false },
  { id: 8, datetime: '2025-10-18 11:50:10', type: 'modificacion', event: 'Cambio de Correo Electrónico', ip: '201.15.8.44', user: 'marta.f@gmail.com', blocked: false },
  { id: 5, datetime: '2025-10-18 11:47:12', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.111', user: 'francisco.martin@email.com', blocked: false },
  { id: 9, datetime: '2025-10-18 11:35:00', type: 'modificacion', event: 'Autenticación 2FA Activada', ip: '190.152.20.1', user: 'david.garcia@email.com', blocked: false },
  { id: 6, datetime: '2025-10-18 11:20:05', type: 'exitoso', event: 'Inicio de Sesión', ip: '192.168.1.115', user: 'patricia.diaz@email.com', blocked: false },
  { id: 7, datetime: '2025-10-18 10:55:41', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.108', user: 'ana.torres@email.com', blocked: true },
  { id: 10, datetime: '2025-10-18 10:15:22', type: 'modificacion', event: 'Exportación de Datos', ip: '181.39.15.112', user: 'luis.r@gmail.com', blocked: false }
];

export const kpiData = {
  failedAttempts: 128,
  blockedAccounts: 4,
  criticalEvents: 8
};
