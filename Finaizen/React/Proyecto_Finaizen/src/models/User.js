/**
 * Modelo de Usuario
 * Representa a un usuario del sistema Finaizen
 */
class User {
  constructor({
    id,
    nombre,
    apellido,
    correo,
    nombreUsuario,
    contraseña,
    pais = 'Ecuador',
    ciudad = '',
    fechaNacimiento,
    genero = '',
    rol = 'user', // 'user' | 'admin'
    perfiles = [],
    notificaciones = [],
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.nombreUsuario = nombreUsuario;
    this.contraseña = contraseña; // En producción, esto estaría hasheado
    this.pais = pais;
    this.ciudad = ciudad;
    this.fechaNacimiento = new Date(fechaNacimiento);
    this.genero = genero; // 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir'
    this.rol = rol;
    this.perfiles = perfiles; // Array de IDs de perfiles
    this.notificaciones = notificaciones;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }

  /**
   * Calcula la edad del usuario basándose en su fecha de nacimiento
   */
  get edad() {
    const today = new Date();
    const birthDate = new Date(this.fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  /**
   * Verifica si el usuario es administrador
   */
  get esAdmin() {
    return this.rol === 'admin';
  }

  /**
   * Verifica si las credenciales son correctas
   */
  verificarContraseña(contraseña) {
    return this.contraseña === contraseña;
  }

  /**
   * Agrega un perfil al usuario
   */
  agregarPerfil(perfilId) {
    if (!this.perfiles.includes(perfilId)) {
      this.perfiles.push(perfilId);
      this.updatedAt = new Date();
    }
  }

  /**
   * Elimina un perfil del usuario
   */
  eliminarPerfil(perfilId) {
    const index = this.perfiles.indexOf(perfilId);
    if (index > -1) {
      this.perfiles.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  /**
   * Serializa el usuario (para guardar en localStorage)
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      nombreUsuario: this.nombreUsuario,
      contraseña: this.contraseña,
      pais: this.pais,
      ciudad: this.ciudad,
      fechaNacimiento: this.fechaNacimiento.toISOString(),
      genero: this.genero,
      rol: this.rol,
      perfiles: this.perfiles,
      notificaciones: this.notificaciones,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Crea una instancia de User desde un objeto JSON
   */
  static fromJSON(json) {
    return new User(json);
  }
}

export default User;
