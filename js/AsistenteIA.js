/**
 * CLASE ASISTENTE DE INTELIGENCIA ARTIFICIAL
 * Responsabilidad: Procesar las preguntas del usuario mediante reglas lógicas 
 * y proveer accesibilidad auditiva a través de síntesis de voz (SpeechSynthesis).
 */
export class AsistenteIA {
  constructor() {
    this.vozActiva = true;
  }

  /**
   * Analiza el texto o la voz ingresada por el adulto mayor y genera una respuesta contextual.
   * @param {string} pregunta - Texto de la consulta realizada.
   * @returns {string} Respuesta generada por el asistente virtual.
   */
  procesarPregunta(pregunta) {
    let respuesta = "Entiendo tu duda sobre: '" + pregunta + "'. Recuerda que puedes ver la guía completa en la sección de Cursos.";
    let txt = pregunta.toLowerCase();

    // Bloque de reglas condicionales para simular IA conversacional gerontológica
    if (txt.includes("prender") || txt.includes("apagar") || txt.includes("celular") || txt.includes("teléfono")) {
      respuesta = "Para encender o apagar el celular, mantén presionado el botón metálico lateral durante tres segundos hasta que aparezca el logo.";
    } else if (txt.includes("cita") || txt.includes("médica") || txt.includes("medica")) {
      respuesta = "Para solicitar una cita médica, ingresa al módulo de cursos y selecciona Citas Médicas.";
    } else if (txt.includes("familiar") || txt.includes("hija") || txt.includes("hijo") || txt.includes("llamada")) {
      respuesta = "Puedes llamar o enviar un mensaje directo a tu familiar ingresando a la pestaña 'Ayuda' abajo.";
    }
    return respuesta;
  }

  /**
   * Convierte texto escrito en salida de audio parlante para asistir a usuarios con baja visión.
   * @param {string} texto - Texto que el sistema leerá en voz alta.
   * @param {string} idioma - Código de idioma (ej: 'es-CO').
   * @param {string} modoSonido - Estado del sonido ('sonido', 'vibracion', 'silencio').
   */
  hablar(texto, idioma, modoSonido) {
    if (modoSonido === 'silencio') return;
    window.speechSynthesis.cancel(); // Cancela locuciones anteriores
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = idioma === 'en' ? 'en-US' : 'es-CO';
    speech.rate = 0.9; // Velocidad pausada ideal para adultos mayores
    window.speechSynthesis.speak(speech);
  }
}