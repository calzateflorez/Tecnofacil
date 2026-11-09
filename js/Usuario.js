/**
 * CLASE GESTOR DE USUARIOS
 * Responsabilidad: Administrar el almacenamiento local (localStorage), 
 * el registro de nuevos usuarios y la validación de credenciales de acceso.
 */
export class GestorUsuarios {
  constructor() {
    // Inicializa cargando los usuarios almacenados o un usuario demo por defecto
    this.usuarios = this.obtenerUsuarios();
  }

  /**
   * Obtiene la lista de usuarios desde el almacenamiento local del navegador.
   * @returns {Array} Lista de objetos de usuario.
   */
  obtenerUsuarios() {
    const guardados = localStorage.getItem('tecnofacil_users');
    if (guardados) {
      return JSON.parse(guardados);
    }
    // Usuario por defecto para pruebas iniciales
    return [{ user: 'usuario', pass: '1234', name: 'Usuario Demo' }];
  }

  /**
   * Registra un nuevo usuario validando que no exista previamente.
   * @param {string} name - Nombre completo del usuario.
   * @param {string} user - Nombre de usuario único.
   * @param {string} pass - Contraseña de acceso.
   */
  registrar(name, user, pass) {
    // Valida si el usuario ya se encuentra registrado en el sistema
    if (this.usuarios.some(u => u.user.toLowerCase() === user.toLowerCase())) {
      throw new Error("El nombre de usuario ya existe. Elija otro.");
    }
    // Agrega y guarda el nuevo usuario
    this.usuarios.push({ user, pass, name });
    localStorage.setItem('tecnofacil_users', JSON.stringify(this.usuarios));
  }

  /**
   * Valida las credenciales de ingreso al sistema.
   * @param {string} user - Usuario ingresado.
   * @param {string} pass - Contraseña ingresada.
   * @returns {Object|undefined} El objeto usuario si coincide, de lo contrario undefined.
   */
  validar(user, pass) {
    return this.usuarios.find(u => u.user.toLowerCase() === user.toLowerCase() && u.pass === pass);
  }
}