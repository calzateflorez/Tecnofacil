import { GestorUsuarios } from './Usuario.js';
import { AsistenteIA } from './AsistenteIA.js';

/**
 * CLASE PRINCIPAL TECNOFACIL APP
 * Responsabilidad: Controlador central (Controller) que gestiona el DOM, 
 * los cambios de pantallas (vistas), la accesibilidad y la interacción entre módulos.
 */
class TecnoFacilApp {
  constructor() {
    this.gestorUsuarios = new GestorUsuarios();
    this.asistente = new AsistenteIA();
    this.idiomaActual = 'es';
    this.modoSonidoActual = 'sonido';
    this.inicializarEventos();
  }

  /**
   * Vincula las funciones globales del DOM con los métodos de la clase (Orientación a Objetos).
   */
  inicializarEventos() {
    window.mostrarRegistro = () => this.mostrarRegistro();
    window.mostrarLogin = () => this.mostrarLogin();
    window.registrarUsuario = () => this.registrarUsuario();
    window.validarIngreso = () => this.validarIngreso();
    window.cerrarSesion = () => this.cerrarSesion();
    window.switchTab = (tab) => this.switchTab(tab);
    window.cambiarTamano = (px) => this.cambiarTamano(px);
    window.cambiarIdioma = () => this.cambiarIdioma();
    window.cambiarModoSonido = () => this.cambiarModoSonido();
    window.llamarFamiliar = () => this.llamarFamiliar();
    window.enviarAlertaFamiliar = () => this.enviarAlertaFamiliar();
    window.cargarLeccion = (tipo) => this.cargarLeccion(tipo);
    window.enviarMensajeAsesor = () => this.enviarMensajeAsesor();
    window.escucharVoz = () => this.escucharVoz();
  }

  // --- GESTIÓN DE VISTAS Y AUTENTICACIÓN ---

  mostrarRegistro() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('regErrorMessage').style.display = 'none';
  }

  mostrarLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
  }

  registrarUsuario() {
    const name = document.getElementById('regName').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const errorDiv = document.getElementById('regErrorMessage');

    if (!name || !user || !pass) {
      errorDiv.innerText = "Por favor complete todos los campos";
      errorDiv.style.display = 'block';
      return;
    }

    try {
      this.gestorUsuarios.registrar(name, user, pass);
      document.getElementById('regName').value = '';
      document.getElementById('regUser').value = '';
      document.getElementById('regPass').value = '';
      
      this.mostrarLogin();
      document.getElementById('loginSuccessMessage').style.display = 'block';
      document.getElementById('username').value = user;
    } catch (error) {
      errorDiv.innerText = error.message;
      errorDiv.style.display = 'block';
    }
  }

  validarIngreso() {
    const userVal = document.getElementById('username').value.trim();
    const passVal = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('loginSuccessMessage');

    const usuarioEncontrado = this.gestorUsuarios.validar(userVal, passVal);

    if (usuarioEncontrado) {
      errorDiv.style.display = 'none';
      if(successDiv) successDiv.style.display = 'none';
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('appSection').style.display = 'block';
      document.getElementById('mainNav').style.display = 'flex';
      
      document.getElementById('welcomeTitle').innerText = "Bienvenido, " + usuarioEncontrado.name;
      this.switchTab('inicio');
    } else {
      errorDiv.style.display = 'block';
      if(successDiv) successDiv.style.display = 'none';
    }
  }

  cerrarSesion() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('appSection').style.display = 'none';
    document.getElementById('mainNav').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
  }

  // --- CONTROL DE NAVEGACIÓN (TABS) ---

  switchTab(tab) {
    const tabs = ['inicio', 'cursos', 'asistente', 'ayuda', 'ajustes'];
    tabs.forEach(t => {
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      document.getElementById('tab' + cap).style.display = (t === tab) ? 'block' : 'none';
      document.getElementById('nav' + cap).classList.toggle('active', t === tab);
    });
  }

  // --- MÓDULO DE CONFIGURACIÓN Y ACCESIBILIDAD ---

  cambiarTamano(px) {
    document.documentElement.style.setProperty('--font-size', px + 'px');
  }

  cambiarIdioma() {
    this.idiomaActual = document.getElementById('langSelect').value;
    let msgs = {
      'es': 'Idioma cambiado a Español.',
      'en': 'Language changed to English.',
      'pt': 'Idioma alterado para Português.',
      'fr': 'Langue changée en Français.'
    };
    alert(msgs[this.idiomaActual]);
  }

  cambiarModoSonido() {
    this.modoSonidoActual = document.getElementById('soundSelect').value;
    alert("Modo de audio actualizado: " + this.modoSonidoActual);
  }

  // --- MÓDULO DE AYUDA Y SOPORTE FAMILIAR ---

  llamarFamiliar() {
    const nombre = document.getElementById('famName').value;
    const tel = document.getElementById('famPhone').value;
    const msg = "Llamando a tu familiar " + nombre + " al número " + tel + "...";
    alert("Simulación de Llamada: " + msg);
    this.asistente.hablar(msg, this.idiomaActual, this.modoSonidoActual);
  }

  enviarAlertaFamiliar() {
    const nombre = document.getElementById('famName').value;
    const msg = "Se ha enviado una alerta de asistencia por mensaje de texto a tu familiar " + nombre + ".";
    alert("Simulación de Alerta: " + msg);
    this.asistente.hablar(msg, this.idiomaActual, this.modoSonidoActual);
  }

  cargarLeccion(tipo) {
    let msg = "";
    if(tipo === 'celular') {
      msg = "Curso de Uso del Celular: 1. Presiona el botón lateral para encender la pantalla. 2. Desliza tu dedo de abajo hacia arriba para desbloquear.";
    } else if(tipo === 'whatsapp') {
      msg = "Lección de WhatsApp: Toca la conversación, escribe tu texto y presiona el botón verde de enviar.";
    } else if(tipo === 'banca') {
      msg = "Simulación Bancaria: En este entorno de prueba simulado nunca se solicitará dinero real.";
    }
    this.switchTab('asistente');
    document.getElementById('respuestaChat').innerText = msg;
    this.asistente.hablar(msg, this.idiomaActual, this.modoSonidoActual);
  }

  enviarMensajeAsesor() {
    const input = document.getElementById('asesorInput');
    const msg = input.value.trim();
    if(!msg) return;

    const chatBox = document.getElementById('chatAsesorBox');
    const userBubble = document.createElement('div');
    userBubble.className = 'bubble bubble-user';
    userBubble.innerText = msg;
    chatBox.appendChild(userBubble);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      const advisorBubble = document.createElement('div');
      advisorBubble.className = 'bubble bubble-advisor';
      advisorBubble.innerHTML = "<strong>Asesor (Carlos):</strong> Recibí tu consulta: '" + msg + "'. Vamos a solucionarlo paso a paso.";
      chatBox.appendChild(advisorBubble);
      chatBox.scrollTop = chatBox.scrollHeight;
      if(this.modoSonidoActual === 'sonido') {
        this.asistente.hablar("Tu asesor Carlos te ha respondido.", this.idiomaActual, this.modoSonidoActual);
      }
    }, 1200);
  }

  // --- MÓDULO DE RECONOCIMIENTO DE VOZ (IA) ---

  escucharVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta entrada de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.idiomaActual === 'en' ? 'en-US' : 'es-CO';
    recognition.start();

    document.getElementById('respuestaChat').innerText = "Escuchando tu pregunta...";

    recognition.onresult = (event) => {
      const textoEscuchado = event.results[0][0].transcript;
      const respuestaIA = this.asistente.procesarPregunta(textoEscuchado);
      document.getElementById('respuestaChat').innerText = "Tú: " + textoEscuchado + "\n\nAsistente IA: " + respuestaIA;
      this.asistente.hablar(respuestaIA, this.idiomaActual, this.modoSonidoActual);
    };
  }
}

// Instancia global de la aplicación modular
const app = new TecnoFacilApp();