import User from '../models/User';
import Perfil, { MONEDAS_POR_PAIS } from '../models/Perfil';
import Ingreso, { CATEGORIAS_INGRESO } from '../models/Ingreso';
import Egreso, { CATEGORIAS_EGRESO } from '../models/Egreso';
import RegistroHistorial from '../models/RegistroHistorial';
import Presupuesto from '../models/Presupuesto';
import Logro, { LOGROS_PREDEFINIDOS } from '../models/Logro';
import Notificacion from '../models/Notificacion';
import SecurityLog, { EventTypes, EventCategories, SeverityLevels, EventStatus } from '../models/SecurityLog';

/**
 * MockDatabase - Base de Datos Simulada para Finaizen
 * Simula una base de datos en memoria con datos de prueba
 * Similar a un "seed" en frameworks como C# Entity Framework
 */
class MockDatabase {
  constructor() {
    this.users = [];
    this.perfiles = [];
    this.ingresos = [];
    this.egresos = [];
    this.historial = [];
    this.presupuestos = [];
    this.logros = [];
    this.notificaciones = [];
    this.securityLogs = [];
    
    // Configuración de seguridad
    this.securityConfig = {
      maxLoginAttempts: 5,              // Máximo de intentos antes de bloqueo
      loginAttemptWindow: 15 * 60 * 1000, // Ventana de tiempo (15 min en ms)
      sessionTimeout: 30 * 60 * 1000,    // Timeout de sesión (30 min)
      requireStrongPassword: true,
      require2FA: false
    };
    
    // Rastreo de intentos de login por usuario
    this.loginAttempts = {};
    
    // Usuario actualmente autenticado
    this.currentUser = null;
    this.currentPerfil = null;

    // Intentar cargar desde localStorage primero
    const loaded = this.loadFromLocalStorage();
    
    // Si no hay datos guardados, cargar datos iniciales
    if (!loaded) {
      this.loadInitialData();
      // Guardar datos iniciales en localStorage
      this.saveToLocalStorage();
    }
  }

  /**
   * Guardar datos en localStorage
   */
  saveToLocalStorage() {
    try {
      const data = {
        users: this.users.map(u => u.toJSON()),
        perfiles: this.perfiles.map(p => p.toJSON()),
        ingresos: this.ingresos.map(i => i.toJSON()),
        egresos: this.egresos.map(e => e.toJSON()),
        historial: this.historial.map(h => h.toJSON()),
        presupuestos: this.presupuestos.map(p => p.toJSON()),
        logros: this.logros.map(l => l.toJSON()),
        notificaciones: this.notificaciones.map(n => n.toJSON()),
        securityLogs: this.securityLogs.map(s => s.toJSON()),
        securityConfig: this.securityConfig,
        loginAttempts: this.loginAttempts
      };
      localStorage.setItem('finaizen_mockdb', JSON.stringify(data));
      console.log('✓ Datos guardados en localStorage');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  /**
   * Cargar datos desde localStorage
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('finaizen_mockdb');
      if (!stored) return false;

      const data = JSON.parse(stored);
      
      // Reconstruir objetos desde JSON
      this.users = data.users.map(u => new User(u));
      this.perfiles = data.perfiles.map(p => {
        // Migración: Agregar array transacciones si no existe
        if (!p.transacciones) {
          p.transacciones = [];
        }
        return new Perfil(p);
      });
      this.ingresos = data.ingresos.map(i => new Ingreso(i));
      this.egresos = data.egresos.map(e => new Egreso(e));
      this.historial = data.historial.map(h => new RegistroHistorial(h));
      this.presupuestos = data.presupuestos.map(p => new Presupuesto(p));
      this.logros = data.logros.map(l => new Logro(l));
      this.notificaciones = data.notificaciones.map(n => new Notificacion(n));
      this.securityLogs = (data.securityLogs || []).map(s => new SecurityLog(s));
      this.securityConfig = data.securityConfig || this.securityConfig;
      this.loginAttempts = data.loginAttempts || {};

      console.log('✓ Datos cargados desde localStorage');
      console.log('Ingresos:', this.ingresos.length);
      console.log('Egresos:', this.egresos.length);
      console.log('Historial:', this.historial.length);
      return true;
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      return false;
    }
  }

  /**
   * Limpiar localStorage (útil para desarrollo)
   */
  clearLocalStorage() {
    localStorage.removeItem('finaizen_mockdb');
    console.log('✓ localStorage limpiado');
  }

  /**
   * SEED - Carga datos iniciales (como Program.cs en C#)
   */
  loadInitialData() {
    // =====================================================
    // USUARIOS DE PRUEBA
    // =====================================================
    
    // Usuario 1: Admin
    const admin = new User({
      id: 1,
      nombre: 'Kevin',
      apellido: 'Administrador',
      correo: 'admin@finaizen.com',
      nombreUsuario: 'admin',
      contraseña: 'admin123', // En producción estaría hasheado
      pais: 'Ecuador',
      ciudad: 'Quito',
      fechaNacimiento: '1995-05-15',
      genero: 'masculino',
      rol: 'admin',
      createdAt: new Date('2024-01-01')
    });

    // Usuario 2: Usuario Regular 1
    const user1 = new User({
      id: 2,
      nombre: 'María',
      apellido: 'González',
      correo: 'maria@example.com',
      nombreUsuario: 'maria.gonzalez',
      contraseña: 'maria123',
      pais: 'Ecuador',
      ciudad: 'Guayaquil',
      fechaNacimiento: '1998-03-20',
      genero: 'femenino',
      rol: 'user',
      createdAt: new Date('2024-02-15')
    });

    // Usuario 3: Usuario Regular 2
    const user2 = new User({
      id: 3,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      correo: 'carlos@example.com',
      nombreUsuario: 'carlos.ramirez',
      contraseña: 'carlos123',
      pais: 'México',
      ciudad: 'Ciudad de México',
      fechaNacimiento: '1992-08-10',
      genero: 'masculino',
      rol: 'user',
      createdAt: new Date('2024-03-01')
    });

    this.users.push(admin, user1, user2);

    // =====================================================
    // PERFILES DE USUARIO
    // =====================================================
    
    // Perfil 0: Perfil Admin
    const perfilAdmin = new Perfil({
      id: 0,
      userId: admin.id,
      nombre: 'Admin',
      moneda: MONEDAS_POR_PAIS['Ecuador'].moneda,
      simboloMoneda: MONEDAS_POR_PAIS['Ecuador'].simbolo,
      createdAt: new Date('2024-01-01')
    });
    admin.agregarPerfil(perfilAdmin.id);

    // Perfil 1: Perfil Personal de María
    const perfilMaria = new Perfil({
      id: 1,
      userId: user1.id,
      nombre: 'Personal',
      moneda: MONEDAS_POR_PAIS['Ecuador'].moneda,
      simboloMoneda: MONEDAS_POR_PAIS['Ecuador'].simbolo,
      createdAt: new Date('2024-02-15')
    });
    user1.agregarPerfil(perfilMaria.id);

    // Perfil 2: Perfil Empresa de María
    const perfilEmpresaMaria = new Perfil({
      id: 2,
      userId: user1.id,
      nombre: 'Negocio',
      moneda: MONEDAS_POR_PAIS['Ecuador'].moneda,
      simboloMoneda: MONEDAS_POR_PAIS['Ecuador'].simbolo,
      createdAt: new Date('2024-02-20')
    });
    user1.agregarPerfil(perfilEmpresaMaria.id);

    // Perfil 3: Perfil Personal de Carlos
    const perfilCarlos = new Perfil({
      id: 3,
      userId: user2.id,
      nombre: 'Personal',
      moneda: MONEDAS_POR_PAIS['México'].moneda,
      simboloMoneda: MONEDAS_POR_PAIS['México'].simbolo,
      createdAt: new Date('2024-03-01')
    });
    user2.agregarPerfil(perfilCarlos.id);

    this.perfiles.push(perfilAdmin, perfilMaria, perfilEmpresaMaria, perfilCarlos);

    // =====================================================
    // INGRESOS (Perfil de María - Personal)
    // =====================================================
    
    const ingreso1 = new Ingreso({
      id: 1,
      perfilId: perfilMaria.id,
      monto: 1500,
      descripcion: 'Salario Mensual',
      categoria: 'Salario',
      frecuencia: 'mensual',
      diaMes: 5,
      horaNotificacion: '09:00',
      notificacionActiva: true,
      createdAt: new Date('2024-02-15')
    });

    const ingreso2 = new Ingreso({
      id: 2,
      perfilId: perfilMaria.id,
      monto: 300,
      descripcion: 'Proyecto Freelance',
      categoria: 'Freelance',
      frecuencia: 'ocasional',
      fechaEspecifica: new Date('2024-11-15'),
      createdAt: new Date('2024-02-20')
    });

    const ingreso3 = new Ingreso({
      id: 3,
      perfilId: perfilMaria.id,
      monto: 50,
      descripcion: 'Intereses de inversión',
      categoria: 'Inversiones',
      frecuencia: 'mensual',
      diaMes: 15,
      createdAt: new Date('2024-03-01')
    });

    this.ingresos.push(ingreso1, ingreso2, ingreso3);
    perfilMaria.agregarIngreso(ingreso1.id);
    perfilMaria.agregarIngreso(ingreso2.id);
    perfilMaria.agregarIngreso(ingreso3.id);

    // =====================================================
    // EGRESOS (Perfil de María - Personal)
    // =====================================================
    
    const egreso1 = new Egreso({
      id: 1,
      perfilId: perfilMaria.id,
      monto: 500,
      descripcion: 'Alquiler',
      categoria: 'Vivienda',
      frecuencia: 'mensual',
      diaMes: 1,
      horaNotificacion: '08:00',
      notificacionActiva: true,
      createdAt: new Date('2024-02-15')
    });

    const egreso2 = new Egreso({
      id: 2,
      perfilId: perfilMaria.id,
      monto: 15.99,
      descripcion: 'Netflix',
      categoria: 'Suscripciones',
      clasificacionIA: 'Suscripciones',
      frecuencia: 'mensual',
      diaMes: 10,
      createdAt: new Date('2024-02-15')
    });

    const egreso3 = new Egreso({
      id: 3,
      perfilId: perfilMaria.id,
      monto: 9.99,
      descripcion: 'Spotify Premium',
      categoria: 'Suscripciones',
      clasificacionIA: 'Suscripciones',
      frecuencia: 'mensual',
      diaMes: 15,
      createdAt: new Date('2024-02-16')
    });

    const egreso4 = new Egreso({
      id: 4,
      perfilId: perfilMaria.id,
      monto: 200,
      descripcion: 'Supermercado',
      categoria: 'Comida',
      clasificacionIA: 'Comida',
      frecuencia: 'semanal',
      diasSemana: [6], // Sábado
      createdAt: new Date('2024-02-17')
    });

    const egreso5 = new Egreso({
      id: 5,
      perfilId: perfilMaria.id,
      monto: 50,
      descripcion: 'Gasolina',
      categoria: 'Transporte',
      clasificacionIA: 'Transporte',
      frecuencia: 'semanal',
      diasSemana: [0, 3], // Domingo y Miércoles
      createdAt: new Date('2024-02-18')
    });

    const egreso6 = new Egreso({
      id: 6,
      perfilId: perfilMaria.id,
      monto: 80,
      descripcion: 'Luz',
      categoria: 'Servicios',
      clasificacionIA: 'Servicios',
      frecuencia: 'mensual',
      diaMes: 20,
      createdAt: new Date('2024-02-18')
    });

    this.egresos.push(egreso1, egreso2, egreso3, egreso4, egreso5, egreso6);
    perfilMaria.agregarEgreso(egreso1.id);
    perfilMaria.agregarEgreso(egreso2.id);
    perfilMaria.agregarEgreso(egreso3.id);
    perfilMaria.agregarEgreso(egreso4.id);
    perfilMaria.agregarEgreso(egreso5.id);
    perfilMaria.agregarEgreso(egreso6.id);

    // =====================================================
    // HISTORIAL (Simulación de registros pasados)
    // =====================================================
    
    // Registros de Octubre 2025
    const hist1 = new RegistroHistorial({
      id: 1,
      perfilId: perfilMaria.id,
      tipo: 'ingreso',
      monto: 1500,
      descripcion: 'Salario Mensual',
      categoria: 'Salario',
      transaccionOrigenId: ingreso1.id,
      fechaEjecucion: new Date('2025-10-05'),
      mes: 10,
      anio: 2025
    });

    const hist2 = new RegistroHistorial({
      id: 2,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 500,
      descripcion: 'Alquiler',
      categoria: 'Vivienda',
      transaccionOrigenId: egreso1.id,
      fechaEjecucion: new Date('2025-10-01'),
      mes: 10,
      anio: 2025
    });

    const hist3 = new RegistroHistorial({
      id: 3,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 15.99,
      descripcion: 'Netflix',
      categoria: 'Suscripciones',
      transaccionOrigenId: egreso2.id,
      fechaEjecucion: new Date('2025-10-10'),
      mes: 10,
      anio: 2025
    });

    const hist4 = new RegistroHistorial({
      id: 4,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 200,
      descripcion: 'Supermercado',
      categoria: 'Comida',
      transaccionOrigenId: egreso4.id,
      fechaEjecucion: new Date('2025-10-12'),
      mes: 10,
      anio: 2025
    });

    // Registros de Noviembre 2025 (MES ACTUAL)
    const hist5 = new RegistroHistorial({
      id: 5,
      perfilId: perfilMaria.id,
      tipo: 'ingreso',
      monto: 1500,
      descripcion: 'Salario Mensual',
      categoria: 'Salario',
      transaccionOrigenId: ingreso1.id,
      fechaEjecucion: new Date('2025-11-05'),
      mes: 11,
      anio: 2025
    });

    const hist6 = new RegistroHistorial({
      id: 6,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 500,
      descripcion: 'Alquiler',
      categoria: 'Vivienda',
      transaccionOrigenId: egreso1.id,
      fechaEjecucion: new Date('2025-11-01'),
      mes: 11,
      anio: 2025
    });

    const hist7 = new RegistroHistorial({
      id: 7,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 15.99,
      descripcion: 'Netflix',
      categoria: 'Suscripciones',
      transaccionOrigenId: egreso2.id,
      fechaEjecucion: new Date('2025-11-02'),
      mes: 11,
      anio: 2025
    });

    const hist8 = new RegistroHistorial({
      id: 8,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 45.50,
      descripcion: 'Supermercado',
      categoria: 'Comida',
      transaccionOrigenId: egreso4.id,
      fechaEjecucion: new Date('2025-11-03'),
      mes: 11,
      anio: 2025
    });

    const hist9 = new RegistroHistorial({
      id: 9,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 80.00,
      descripcion: 'Gasolina',
      categoria: 'Transporte',
      transaccionOrigenId: egreso5.id,
      fechaEjecucion: new Date('2025-11-06'),
      mes: 11,
      anio: 2025
    });

    const hist10 = new RegistroHistorial({
      id: 10,
      perfilId: perfilMaria.id,
      tipo: 'egreso',
      monto: 120.00,
      descripcion: 'Compras del mes',
      categoria: 'Comida',
      transaccionOrigenId: egreso4.id,
      fechaEjecucion: new Date('2025-11-07'),
      mes: 11,
      anio: 2025
    });

    const hist11 = new RegistroHistorial({
      id: 11,
      perfilId: perfilMaria.id,
      tipo: 'ingreso',
      monto: 200,
      descripcion: 'Freelance',
      categoria: 'Ingresos Extra',
      transaccionOrigenId: ingreso2.id,
      fechaEjecucion: new Date('2025-11-08'),
      mes: 11,
      anio: 2025
    });

    this.historial.push(hist1, hist2, hist3, hist4, hist5, hist6, hist7, hist8, hist9, hist10, hist11);

    // =====================================================
    // PRESUPUESTOS
    // =====================================================
    
    const pres1 = new Presupuesto({
      id: 1,
      perfilId: perfilMaria.id,
      categoria: 'Comida',
      montoLimite: 400,
      montoGastado: 320,
      periodo: 'mensual',
      alertaEn: 80,
      mes: 11,
      anio: 2025
    });

    const pres2 = new Presupuesto({
      id: 2,
      perfilId: perfilMaria.id,
      categoria: 'Transporte',
      montoLimite: 150,
      montoGastado: 80,
      periodo: 'mensual',
      alertaEn: 80,
      mes: 11,
      anio: 2025
    });

    const pres3 = new Presupuesto({
      id: 3,
      perfilId: perfilMaria.id,
      categoria: 'Suscripciones',
      montoLimite: 50,
      montoGastado: 15.99,
      periodo: 'mensual',
      alertaEn: 80,
      mes: 11,
      anio: 2025
    });

    const pres4 = new Presupuesto({
      id: 4,
      perfilId: perfilMaria.id,
      categoria: 'Entretenimiento',
      montoLimite: 100,
      montoGastado: 25,
      periodo: 'mensual',
      alertaEn: 80,
      mes: 11,
      anio: 2025
    });

    this.presupuestos.push(pres1, pres2, pres3, pres4);
    perfilMaria.agregarPresupuesto(pres1.id);
    perfilMaria.agregarPresupuesto(pres2.id);
    perfilMaria.agregarPresupuesto(pres3.id);
    perfilMaria.agregarPresupuesto(pres4.id);

    // =====================================================
    // LOGROS
    // =====================================================
    
    // Crear logros para María basados en los predefinidos
    LOGROS_PREDEFINIDOS.forEach(logroTemplate => {
      const logro = new Logro({
        ...logroTemplate,
        perfilId: perfilMaria.id
      });

      // Desbloquear algunos logros automáticamente
      if (logroTemplate.id === 'logro_primer_ingreso' || 
          logroTemplate.id === 'logro_primer_egreso' ||
          logroTemplate.id === 'logro_primer_presupuesto') {
        logro.desbloquear();
      }

      // Progreso parcial en otros
      if (logroTemplate.id === 'logro_racha_7_dias') {
        logro.actualizarProgreso(5);
      }

      if (logroTemplate.id === 'logro_50_registros') {
        logro.actualizarProgreso(12);
      }

      this.logros.push(logro);
      perfilMaria.agregarLogro(logro.id);
    });

    // =====================================================
    // NOTIFICACIONES
    // =====================================================
    
    const notif1 = new Notificacion({
      id: 1,
      userId: user1.id,
      perfilId: perfilMaria.id,
      tipo: 'warning',
      titulo: 'Presupuesto: Comida',
      mensaje: '¡Cuidado! Estás llegando al límite.',
      icono: '🔔',
      accionUrl: '/presupuestos',
      leida: false,
      createdAt: new Date()
    });

    const notif2 = new Notificacion({
      id: 2,
      userId: user1.id,
      perfilId: perfilMaria.id,
      tipo: 'error',
      titulo: 'Presupuesto: Suscripciones',
      mensaje: '¡Tomar medidas! Has excedido el presupuesto.',
      icono: '⚠️',
      accionUrl: '/presupuestos',
      leida: false,
      createdAt: new Date()
    });

    const notif3 = new Notificacion({
      id: 3,
      userId: user1.id,
      perfilId: perfilMaria.id,
      tipo: 'logro',
      titulo: '🏆 ¡Nuevo Logro Desbloqueado!',
      mensaje: 'Has desbloqueado "Primer Paso": Registra tu primer ingreso',
      icono: '🎯',
      accionUrl: '/logros',
      leida: true,
      createdAt: new Date('2024-02-15')
    });

    this.notificaciones.push(notif1, notif2, notif3);

    console.log('✅ MockDatabase cargada con datos iniciales');
    console.log(`📊 Usuarios: ${this.users.length}`);
    console.log(`📊 Perfiles: ${this.perfiles.length}`);
    console.log(`📊 Ingresos: ${this.ingresos.length}`);
    console.log(`📊 Egresos: ${this.egresos.length}`);
    console.log(`📊 Historial: ${this.historial.length}`);
    console.log(`📊 Presupuestos: ${this.presupuestos.length}`);
    console.log(`📊 Logros: ${this.logros.length}`);
    console.log(`📊 Notificaciones: ${this.notificaciones.length}`);
  }

  // =====================================================
  // MÉTODOS DE AUTENTICACIÓN
  // =====================================================

  /**
   * Inicia sesión con credenciales
   */
  login(correoOUsername, contraseña) {
    // Debug logs (comentar en producción)
    // console.log('� MockDB Login - Intentando con:', correoOUsername);
    
    const user = this.users.find(u => {
      const correoMatch = u.correo === correoOUsername;
      const usernameMatch = u.nombreUsuario === correoOUsername;
      const passwordMatch = u.verificarContraseña(contraseña);
      
      return (correoMatch || usernameMatch) && passwordMatch;
    });

    if (user) {
      this.currentUser = user;
      
      // Seleccionar el primer perfil automáticamente
      const primerPerfil = this.perfiles.find(p => p.userId === user.id);
      if (primerPerfil) {
        this.currentPerfil = primerPerfil;
      }

      console.log('✅ Login exitoso:', user.nombreCompleto);
      return {
        success: true,
        user,
        perfil: primerPerfil
      };
    }

    console.log('❌ Login fallido: Credenciales incorrectas');
    return {
      success: false,
      message: 'Credenciales incorrectas'
    };
  }

  /**
   * Cierra la sesión actual
   */
  logout() {
    this.currentUser = null;
    this.currentPerfil = null;
  }

  /**
   * Registra un nuevo usuario
   */
  register(userData) {
    // Verificar si el correo ya existe
    if (this.users.some(u => u.correo === userData.correo)) {
      return {
        success: false,
        message: 'El correo ya está registrado'
      };
    }

    // Verificar si el nombre de usuario ya existe
    if (this.users.some(u => u.nombreUsuario === userData.nombreUsuario)) {
      return {
        success: false,
        message: 'El nombre de usuario ya existe'
      };
    }

    // Generar nuevo ID (auto-increment)
    const newUserId = this.users.length > 0 
      ? Math.max(...this.users.map(u => u.id)) + 1 
      : 1;

    // Crear el nuevo usuario
    const newUser = new User({
      id: newUserId,
      ...userData
    });

    // Crear perfil inicial con el nombre de usuario
    const monedaInfo = MONEDAS_POR_PAIS[userData.pais] || MONEDAS_POR_PAIS['Ecuador'];
    const newPerfilId = this.perfiles.length > 0
      ? Math.max(...this.perfiles.map(p => p.id)) + 1
      : 1;

    const newPerfil = new Perfil({
      id: newPerfilId,
      userId: newUser.id,
      nombre: userData.nombreUsuario,
      moneda: monedaInfo.moneda,
      simboloMoneda: monedaInfo.simbolo
    });

    newUser.agregarPerfil(newPerfil.id);

    // Crear logros iniciales para el perfil
    LOGROS_PREDEFINIDOS.forEach(logroTemplate => {
      const logro = new Logro({
        ...logroTemplate,
        perfilId: newPerfil.id
      });
      this.logros.push(logro);
      newPerfil.agregarLogro(logro.id);
    });

    this.users.push(newUser);
    this.perfiles.push(newPerfil);

    // Autenticar automáticamente
    this.currentUser = newUser;
    this.currentPerfil = newPerfil;

    return {
      success: true,
      user: newUser,
      perfil: newPerfil
    };
  }

  // =====================================================
  // GETTERS DE DATOS
  // =====================================================

  /**
   * Obtiene todos los perfiles de un usuario
   */
  getPerfilesDeUsuario(userId) {
    return this.perfiles.filter(p => p.userId === userId);
  }

  /**
   * Obtiene todos los ingresos de un perfil
   */
  getIngresosDePerf(perfilId) {
    return this.ingresos.filter(i => i.perfilId === perfilId);
  }

  /**
   * Obtiene todos los egresos de un perfil
   */
  getEgresosDePerf(perfilId) {
    return this.egresos.filter(e => e.perfilId === perfilId);
  }

  /**
   * Obtiene el historial de un perfil
   */
  getHistorialDePerfil(perfilId, mes = null, anio = null) {
    let registros = this.historial.filter(h => h.perfilId === perfilId);
    
    if (mes !== null) {
      registros = registros.filter(h => h.mes === mes);
    }
    
    if (anio !== null) {
      registros = registros.filter(h => h.anio === anio);
    }
    
    return registros.sort((a, b) => b.fechaEjecucion - a.fechaEjecucion);
  }

  /**
   * Obtiene los presupuestos de un perfil
   */
  getPresupuestosDePerfil(perfilId) {
    return this.presupuestos.filter(p => p.perfilId === perfilId);
  }

  /**
   * Obtiene los logros de un perfil
   */
  getLogrosDePerfil(perfilId) {
    return this.logros.filter(l => l.perfilId === perfilId);
  }

  /**
   * Obtiene las notificaciones de un usuario
   */
  getNotificacionesDeUsuario(userId, soloNoLeidas = false) {
    let notifs = this.notificaciones.filter(n => n.userId === userId);
    
    if (soloNoLeidas) {
      notifs = notifs.filter(n => !n.leida);
    }
    
    return notifs.sort((a, b) => b.createdAt - a.createdAt);
  }

  // =====================================================
  // SEGURIDAD Y LOGS
  // =====================================================

  /**
   * Crea un log de seguridad
   */
  createSecurityLog(logData) {
    const log = new SecurityLog(logData);
    this.securityLogs.push(log);
    this.saveToLocalStorage();
    
    // Si es evento crítico, puede disparar alertas adicionales
    if (log.severity === SeverityLevels.CRITICAL) {
      console.warn('🚨 Evento de seguridad crítico:', log.description);
    }
    
    return log;
  }

  /**
   * Obtiene todos los logs de seguridad ordenados por fecha
   */
  getAllSecurityLogs() {
    return [...this.securityLogs].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  /**
   * Filtra logs de seguridad por criterios
   */
  getSecurityLogs(filters = {}) {
    let logs = [...this.securityLogs];
    
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }
    
    if (filters.userEmail) {
      logs = logs.filter(log => 
        log.userEmail && log.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase())
      );
    }
    
    if (filters.eventType) {
      logs = logs.filter(log => log.eventType === filters.eventType);
    }
    
    if (filters.eventCategory) {
      logs = logs.filter(log => log.eventCategory === filters.eventCategory);
    }
    
    if (filters.status) {
      logs = logs.filter(log => log.status === filters.status);
    }
    
    if (filters.severity) {
      logs = logs.filter(log => log.severity === filters.severity);
    }
    
    if (filters.startDate) {
      logs = logs.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      logs = logs.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      logs = logs.filter(log => 
        (log.userEmail && log.userEmail.toLowerCase().includes(term)) ||
        log.description.toLowerCase().includes(term) ||
        log.ipAddress.includes(term)
      );
    }
    
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Obtiene los últimos N logs de un usuario
   */
  getUserRecentActivity(userId, limit = 10) {
    return this.securityLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Obtiene estadísticas de seguridad
   */
  getSecurityStats(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = this.securityLogs.filter(log => 
      new Date(log.timestamp) >= cutoffTime
    );
    
    // Agrupar por categoría
    const byCategory = {};
    Object.values(EventCategories).forEach(cat => {
      byCategory[cat] = recentLogs.filter(log => log.eventCategory === cat).length;
    });
    
    // Agrupar por severidad
    const bySeverity = {};
    Object.values(SeverityLevels).forEach(sev => {
      bySeverity[sev] = recentLogs.filter(log => log.severity === sev).length;
    });
    
    return {
      totalEvents: recentLogs.length,
      failedLogins: recentLogs.filter(log => 
        log.eventType === EventTypes.LOGIN_FAILURE
      ).length,
      criticalEvents: recentLogs.filter(log => 
        log.severity === SeverityLevels.CRITICAL
      ).length,
      blockedAccounts: new Set(
        recentLogs
          .filter(log => log.eventType === EventTypes.ACCOUNT_SUSPENDED)
          .map(log => log.userId)
      ).size,
      uniqueIPs: new Set(recentLogs.map(log => log.ipAddress)).size,
      byCategory,
      bySeverity
    };
  }

  /**
   * Rastrea intentos de login
   */
  trackLoginAttempt(email, success, ipAddress = null) {
    const ip = ipAddress || `192.168.1.${Math.floor(Math.random() * 255)}`;
    
    if (!this.loginAttempts[email]) {
      this.loginAttempts[email] = {
        count: 0,
        firstAttempt: Date.now(),
        lastAttempt: Date.now(),
        ips: []
      };
    }
    
    const attempt = this.loginAttempts[email];
    const now = Date.now();
    
    // Resetear si pasó la ventana de tiempo
    if (now - attempt.firstAttempt > this.securityConfig.loginAttemptWindow) {
      attempt.count = 0;
      attempt.firstAttempt = now;
      attempt.ips = [];
    }
    
    if (!success) {
      attempt.count++;
      attempt.lastAttempt = now;
      if (!attempt.ips.includes(ip)) {
        attempt.ips.push(ip);
      }
      
      // Crear log de intento fallido
      this.createSecurityLog({
        userId: null,
        userEmail: email,
        eventType: EventTypes.LOGIN_FAILURE,
        eventCategory: EventCategories.AUTENTICACION,
        description: `Intento de inicio de sesión fallido`,
        ipAddress: ip,
        status: EventStatus.FAILURE,
        severity: attempt.count >= 3 ? SeverityLevels.HIGH : SeverityLevels.MEDIUM,
        metadata: {
          attemptNumber: attempt.count,
          totalAttempts: attempt.count
        }
      });
      
      // Bloquear si excede intentos
      if (attempt.count >= this.securityConfig.maxLoginAttempts) {
        this.createSecurityLog({
          userId: null,
          userEmail: email,
          eventType: EventTypes.MULTIPLE_LOGIN_FAILURES,
          eventCategory: EventCategories.SOSPECHOSO,
          description: `Cuenta bloqueada por múltiples intentos fallidos (${attempt.count})`,
          ipAddress: ip,
          status: EventStatus.FAILURE,
          severity: SeverityLevels.CRITICAL,
          metadata: {
            totalAttempts: attempt.count,
            timeWindow: this.securityConfig.loginAttemptWindow,
            ips: attempt.ips
          }
        });
        
        return { blocked: true, attempts: attempt.count };
      }
      
      return { blocked: false, attempts: attempt.count };
    } else {
      // Login exitoso
      const user = this.users.find(u => u.email === email);
      
      this.createSecurityLog({
        userId: user?.id || null,
        userEmail: email,
        eventType: EventTypes.LOGIN_SUCCESS,
        eventCategory: EventCategories.AUTENTICACION,
        description: 'Inicio de sesión exitoso',
        ipAddress: ip,
        status: EventStatus.SUCCESS,
        severity: SeverityLevels.LOW
      });
      
      // Resetear contador de intentos
      delete this.loginAttempts[email];
      return { blocked: false, attempts: 0 };
    }
  }

  /**
   * Verifica si un usuario está bloqueado
   */
  isUserBlocked(email) {
    const attempt = this.loginAttempts[email];
    if (!attempt) return false;
    
    const now = Date.now();
    
    // Si pasó la ventana de tiempo, ya no está bloqueado
    if (now - attempt.firstAttempt > this.securityConfig.loginAttemptWindow) {
      delete this.loginAttempts[email];
      return false;
    }
    
    return attempt.count >= this.securityConfig.maxLoginAttempts;
  }

  /**
   * Método de debugging para verificar datos del perfil actual
   */
  debugCurrentProfile() {
    if (!this.currentPerfil) {
      console.log('❌ No hay perfil activo');
      return;
    }

    console.log('=== DEBUG PERFIL ACTUAL ===');
    console.log('ID:', this.currentPerfil.id);
    console.log('Nombre:', this.currentPerfil.nombre);
    console.log('Usuario ID:', this.currentPerfil.userId);
    console.log('\n📊 DATOS DEL PERFIL:');
    console.log('Ingresos recurrentes (IDs):', this.currentPerfil.ingresos);
    console.log('Egresos recurrentes (IDs):', this.currentPerfil.egresos);
    console.log('Transacciones (IDs):', this.currentPerfil.transacciones || []);
    console.log('\n📋 REGISTROS EN MOCKDB:');
    console.log('Total ingresos recurrentes:', this.ingresos.filter(i => i.perfilId === this.currentPerfil.id).length);
    console.log('Total egresos recurrentes:', this.egresos.filter(e => e.perfilId === this.currentPerfil.id).length);
    console.log('Total en historial:', this.historial.filter(h => h.perfilId === this.currentPerfil.id).length);
    console.log('\n📝 DETALLE HISTORIAL:');
    const historialPerfil = this.historial.filter(h => h.perfilId === this.currentPerfil.id);
    historialPerfil.forEach(h => {
      console.log(`- [${h.tipo}] ${h.descripcion}: $${h.monto} (${h.fechaEjecucion.toLocaleDateString()}) - OrigenID: ${h.transaccionOrigenId || 'Ocasional'}`);
    });
  }
}

// Crear instancia única (Singleton)
const mockDB = new MockDatabase();

// Exportar tipos de eventos para uso fácil
export { EventTypes, EventCategories, SeverityLevels, EventStatus };

export default mockDB;
