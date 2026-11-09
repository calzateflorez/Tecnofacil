// ==========================================
// 1. CLASE GESTOR DE USUARIOS (AUTENTICACIÓN)
// ==========================================
class GestorUsuarios {
  constructor() {
    this.usuarios = this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const guardados = localStorage.getItem('tecnofacil_users');
    if (guardados) {
      return JSON.parse(guardados);
    }
    return [{ user: 'usuario', pass: '1234', name: 'Usuario Demo' }];
  }

  registrar(name, user, pass) {
    if (this.usuarios.some(u => u.user.toLowerCase() === user.toLowerCase())) {
      throw new Error("El nombre de usuario ya existe. Elija otro.");
    }
    this.usuarios.push({ user, pass, name });
    localStorage.setItem('tecnofacil_users', JSON.stringify(this.usuarios));
  }

  validar(user, pass) {
    return this.usuarios.find(u => u.user.toLowerCase() === user.toLowerCase() && u.pass === pass);
  }
}

// ==========================================
// 2. CLASE ASISTENTE DE INTELIGENCIA ARTIFICIAL
// ==========================================
class AsistenteIA {
  constructor() {
    this.vozActiva = true;
  }

  procesarPregunta(pregunta, idioma) {
    let respuesta = "Entiendo tu duda sobre: '" + pregunta + "'. Recuerda que puedes ver la guía completa en la sección de Cursos.";
    let txt = pregunta.toLowerCase();

    if (txt.includes("prender") || txt.includes("apagar") || txt.includes("celular") || txt.includes("teléfono")) {
      respuesta = "Para encender o apagar el celular, mantén presionado el botón metálico lateral durante tres segundos hasta que aparezca el logo.";
    } else if (txt.includes("cita") || txt.includes("médica") || txt.includes("medica")) {
      respuesta = "Para solicitar una cita médica, ingresa al módulo de cursos y selecciona Citas Médicas.";
    } else if (txt.includes("familiar") || txt.includes("hija") || txt.includes("hijo") || txt.includes("llamada")) {
      respuesta = "Puedes llamar o enviar un mensaje directo a tu familiar ingresando a la pestaña 'Ayuda' abajo.";
    }
    return respuesta;
  }

  hablar(texto, idioma, modoSonido) {
    if (modoSonido === 'silencio') return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = idioma === 'en' ? 'en-US' : 'es-CO';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  }
}

// ==========================================
// 3. CLASE PRINCIPAL DE LA APLICACIÓN (CONTROLADOR)
// ==========================================
class TecnoFacilApp {
  constructor() {
    this.gestorUsuarios = new GestorUsuarios();
    this.asistente = new AsistenteIA();
    this.idiomaActual = 'es';
    this.modoSonidoActual = 'sonido';
  }

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

  switchTab(tab) {
    const tabs = ['inicio', 'cursos', 'asistente', 'ayuda', 'ajustes'];
    tabs.forEach(t => {
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      document.getElementById('tab' + cap).style.display = (t === tab) ? 'block' : 'none';
      document.getElementById('nav' + cap).classList.toggle('active', t === tab);
    });
  }

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
      msg = "Curso de Uso del Celular: 1. Presiona el botón lateral para encender la pantalla. 2. Desliza tu dedo de abajo hacia arriba para desbloquear. 3. Para subir el volumen usa los botones al costado del teléfono.";
    } else if(tipo === 'whatsapp') {
      msg = "Lección de WhatsApp: Para responder un mensaje, toca la conversación con el nombre de tu familiar, presiona el cuadro blanco abajo, escribe tu texto y presiona el botón verde de la flechita.";
    } else if(tipo === 'banca') {
      msg = "Simulación Bancaria: En este entorno de prueba simulado nunca se solicitará dinero real ni claves de 4 dígitos.";
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
      advisorBubble.innerHTML = "<strong>Asesor (Carlos):</strong> Recibí tu consulta: '" + msg + "'. No te preocupes, vamos a solucionarlo juntos paso a paso.";
      chatBox.appendChild(advisorBubble);
      chatBox.scrollTop = chatBox.scrollHeight;
      if(this.modoSonidoActual === 'sonido') {
        this.asistente.hablar("Tu asesor Carlos te ha respondido.", this.idiomaActual, this.modoSonidoActual);
      }
    }, 1200);
  }

  escucharVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta entrada de voz. Intenta con Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.idiomaActual === 'en' ? 'en-US' : 'es-CO';
    recognition.start();

    document.getElementById('respuestaChat').innerText = "Escuchando tu pregunta...";

    recognition.onresult = (event) => {
      const textoEscuchado = event.results[0][0].transcript;
      const respuestaIA = this.asistente.procesarPregunta(textoEscuchado, this.idiomaActual);
      document.getElementById('respuestaChat').innerText = "Tú: " + textoEscuchado + "\n\nAsistente IA: " + respuestaIA;
      this.asistente.hablar(respuestaIA, this.idiomaActual, this.modoSonidoActual);
    };
  }
}

// Instanciar la aplicación globalmente
const app = new TecnoFacilApp();

// Funciones puente hacia el HTML
function mostrarRegistro() { app.mostrarRegistro(); }
function mostrarLogin() { app.mostrarLogin(); }
function registrarUsuario() { app.registrarUsuario(); }
function validarIngreso() { app.validarIngreso(); }
function cerrarSesion() { app.cerrarSesion(); }
function switchTab(tab) { app.switchTab(tab); }
function cambiarTamano(px) { app.cambiarTamano(px); }
function cambiarIdioma() { app.cambiarIdioma(); }
function cambiarModoSonido() { app.cambiarModoSonido(); }
function llamarFamiliar() { app.llamarFamiliar(); }
function enviarAlertaFamiliar() { app.enviarAlertaFamiliar(); }
function cargarLeccion(tipo) { app.cargarLeccion(tipo); }
function enviarMensajeAsesor() { app.enviarMensajeAsesor(); }
function escucharVoz() { app.escucharVoz(); }
