
// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

const COLOR_CUADRICULA = "#1f1f3d";
const COLOR_PARTE = "#10b981";
const COLOR_BORDE_PARTE = "#34d399";
const COLOR_CABEZA = "#facc15";
const COLOR_BORDE_CABEZA = "#b45309";
const COLOR_COMIDA = "#ec4899";
const COLOR_BORDE_COMIDA = "#f472b6";

let serpiente = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
let comida = { x: 15, y: 10 };
let puntaje = 0;

let intervaloSerpiente = null;
let direccionActual = "derecha";
const VELOCIDAD = 500;
let velocidadActual = VELOCIDAD;
let nuevaVelocidad = velocidadActual;
let direccionSiguiente = "derecha";
let estado = "reiniciar";
let estadoNuevo = estado;

//Sonidos
const sonidoComer = new Audio("sonidos/comer.mp3");
const sonidoPerder = new Audio("sonidos/gameOver.mp3");
const sonidoCambioDireccion = new Audio("sonidos/cambioDireccion.mp3");
const sonidoCambioDireccionNegado = new Audio("sonidos/cambioDireccionNegado.mp3");
const sonidoInicio = new Audio("sonidos/inicio.mp3");
const sonidoPause = new Audio("sonidos/pause.mp3");
const sonidoReiniciar = new Audio("sonidos/reiniciar.mp3");

// Primera pintura del juego al cargar la página
dibujarTodo();

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarSerpiente();
  pintarComida();
}

function dibujarTablero() {
  ctx.strokeStyle = COLOR_CUADRICULA;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i += TAMANIO_CELDA) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i < canvas.height; i += TAMANIO_CELDA) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);

  }
  ctx.stroke();
}

function pintarParte(lineaX, lineaY, color_relleno, color_borde) {
  ctx.fillStyle = color_relleno;
  ctx.fillRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA)
  ctx.strokeStyle = color_borde;
  ctx.strokeRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarCabeza() {
  pintarParte(serpiente[0].x, serpiente[0].y, COLOR_CABEZA, COLOR_BORDE_CABEZA);
}

function pintarSerpiente() {
  for (let i = 1; i < serpiente.length; i++) {
    pintarParte(serpiente[i].x, serpiente[i].y, COLOR_PARTE, COLOR_BORDE_PARTE);
  }
  pintarCabeza();
}

function moverDerecha() {
  let posicion_cabeza = serpiente[0];
  let nueva_posicion = {
    x: posicion_cabeza.x + 1,
    y: posicion_cabeza.y
  };
  serpiente.unshift(nueva_posicion);
  serpiente.pop();
}

function moverIzquierda() {
  let posicion_cabeza = serpiente[0];
  let nueva_posicion = {
    x: posicion_cabeza.x - 1,
    y: posicion_cabeza.y
  };
  serpiente.unshift(nueva_posicion);
  serpiente.pop();
}

function moverArriba() {
  let posicion_cabeza = serpiente[0];
  let nueva_posicion = {
    x: posicion_cabeza.x,
    y: posicion_cabeza.y - 1
  };
  serpiente.unshift(nueva_posicion);
  serpiente.pop();
}

function moverAbajo() {
  let posicion_cabeza = serpiente[0];
  let nueva_posicion = {
    x: posicion_cabeza.x,
    y: posicion_cabeza.y + 1
  };
  serpiente.unshift(nueva_posicion);
  serpiente.pop();
}

function cambiarDireccion(direccion) {
  if (intervaloSerpiente == null) return;
  if ((direccion == "derecha"   && direccionActual == "izquierda") ||
      (direccion == "izquierda" && direccionActual == "derecha")   ||
      (direccion == "arriba"    && direccionActual == "abajo")     ||
      (direccion == "abajo"     && direccionActual == "arriba")) {
    sonidoCambioDireccionNegado.currentTime = 0;
    sonidoCambioDireccionNegado.play();
    return;
  }
  direccionSiguiente = direccion;
  sonidoCambioDireccion.currentTime = 0;
  sonidoCambioDireccion.play();
}

function iniciarJuego() {
  if (intervaloSerpiente !== null) return;
  intervaloSerpiente = setInterval(moverSerpiente, velocidadActual);
  estadoNuevo = "jugando";
  actualizarInterfaz();
  sonidoInicio.currentTime = 0;
  sonidoInicio.play();
}

function pausarJuego() {
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  estadoNuevo = "pausa";
  actualizarInterfaz();
  sonidoPause.currentTime = 0;
  sonidoPause.play();
}

function moverSerpiente() {
  direccionActual = direccionSiguiente;
  let choque = perder();
  if (choque.estado) {
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = null;
    sonidoPerder.currentTime = 0;
    sonidoPerder.play();
    estadoNuevo = "perder";
    actualizarInterfaz(choque.causa);
    return;
  }
  switch (direccionActual) {
    case "derecha":
      moverDerecha();
      break;
    case "izquierda":
      moverIzquierda();
      break;
    case "arriba":
      moverArriba();
      break;
    case "abajo":
      moverAbajo();
      break;
    default:
      break;
  }
  dibujarTodo();
  if (atraparComida()) {
    generarComida();
    crecerSerpiente();
    dibujarTodo();
    sonidoComer.currentTime = 0;
    sonidoComer.play();
    puntaje += 1;
    let cmpPuntaje = document.getElementById("puntaje");
    cmpPuntaje.innerText = puntaje;
    ajustarVelocidad();
  }
}

function pintarComida() {
  pintarParte(comida.x, comida.y, COLOR_COMIDA, COLOR_BORDE_COMIDA);
}

function generarComida() {
  let colision;
  do {
    colision = false;
    comida.x = numeroAleatorio(0, canvas.width / TAMANIO_CELDA - 1);
    comida.y = numeroAleatorio(0, canvas.height / TAMANIO_CELDA - 1);

    for (let i = 0; i < serpiente.length; i++) {
      if (comida.x === serpiente[i].x && comida.y === serpiente[i].y) {
        colision = true;
        break;
      }
    }
  } while (colision);
}

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function atraparComida() {
  if (comida.x == serpiente[0].x && comida.y == serpiente[0].y) {
    return true;
  } else {
    return false;
  }
}

function crecerSerpiente() {
  let cola = serpiente[serpiente.length - 1];
  let nueva_cola = { x: cola.x, y: cola.y };
  switch (direccionActual) {
    case "derecha":
      nueva_cola.x = cola.x - 1;
      break;
    case "izquierda":
      nueva_cola.x = cola.x + 1;
      break;
    case "arriba":
      nueva_cola.y = cola.y + 1;
      break;
    case "abajo":
      nueva_cola.y = cola.y - 1;
      break;
    default:
      break;
  }
  serpiente.push(nueva_cola);
}

function perder() {
  let cabeza = serpiente[0];
  let maxX = canvas.width / TAMANIO_CELDA - 1;
  let maxY = canvas.height / TAMANIO_CELDA - 1;

  let estado = false;
  let causa = "";

  let dx = 0, dy = 0;
  if (direccionActual === "izquierda") dx = -1;
  else if (direccionActual === "derecha") dx = 1;
  else if (direccionActual === "arriba") dy = -1;
  else if (direccionActual === "abajo") dy = 1;

  let proximaX = cabeza.x + dx;
  let proximaY = cabeza.y + dy;

  if ((proximaX < 0 || proximaX > maxX) ||
    (proximaY < 0 || proximaY > maxY)) {
    estado = true;
    causa = "CHOCASTE CON EL BORDE";
  }

  for (let i = 1; i < serpiente.length; i++) {
    if (serpiente[i].x === proximaX && serpiente[i].y === proximaY) {
      estado = true;
      causa = "CHOCASTE CONTIGO";
    }
  }

  return { estado, causa };
}

function reiniciarJuego() {
  let cmpPuntaje = document.getElementById("puntaje");


  if (intervaloSerpiente != null) {
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = null;
  }

  direccionActual = "derecha";
  direccionSiguiente = "derecha";
  puntaje = 0;
  cmpPuntaje.innerText = puntaje;
  velocidadActual = VELOCIDAD;
  nuevaVelocidad = VELOCIDAD;

  serpiente = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
  comida = { x: 15, y: 10 };

  dibujarTodo();
  estadoNuevo = "reiniciar";
  actualizarInterfaz();
  sonidoReiniciar.currentTime = 0;
  sonidoReiniciar.play();
}

function ajustarVelocidad() {
  if (puntaje >= 40) {
    nuevaVelocidad = 100;
  } else if (puntaje >= 30) {
    nuevaVelocidad = 200;
  } else if (puntaje >= 20) {
    nuevaVelocidad = 300;
  } else if (puntaje >= 10) {
    nuevaVelocidad = 400;
  }

  if (nuevaVelocidad != velocidadActual) {
    let cmpEstado = document.getElementById("estado");
    let msgEstado = "Jugando 🔥 Velocidad: " + (112.5-(velocidadActual*0.125)).toFixed(0)+"%";
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = setInterval(moverSerpiente, nuevaVelocidad);
    velocidadActual = nuevaVelocidad;
    cmpEstado.innerText = msgEstado;
  }
}


function actualizarInterfaz(causaPerder) {
  if (estadoNuevo !== estado) {
    let cmpDescripcion = document.getElementById("txtdescripcion");
    let cmpPuntaje = document.getElementById("puntaje");
    let cmpEstado = document.getElementById("estado");
    let cmpMensaje = document.getElementById("mensaje");


    let msgDescripcion = "";
    let msgPuntaje = "";
    let msgEstado = "";
    let msgMensaje = "";

    estado = estadoNuevo;

    switch (estado) {
      case "reiniciar":
        msgDescripcion = "🐍 ¡A comer y crecer! ¿Cuántos puntos puedes lograr?";
        msgEstado = "Listo 😎";
        msgMensaje = "Presiona Iniciar cuando estés preparado. ¡La serpiente tiene hambre!"
        break;
      case "jugando":
        msgDescripcion = "🐍 ¡A comer y crecer! ¿Cuántos puntos puedes lograr?";
        msgEstado = "Jugando 🔥 Velocidad: " + (112.5-(velocidadActual*0.125)).toFixed(0)+"%";
        msgMensaje = "Usa las flechas para moverte. ¡Cada bocado cuenta!"
        break;
      case "pausa":
        msgDescripcion = "☕ Pausa merecida, respira tranquilo";
        msgEstado = "En pausa ⏸️";
        msgMensaje = "Presiona Iniciar para volver a la acción."
        break;
      case "perder":
        msgDescripcion = "💪 ¡Casi lo tienes! Inténtalo otra vez";
        msgEstado = "GAME OVER 💀";
        msgMensaje = causaPerder + " (Presiona Reiniciar para una revancha)."
        alert("💀 GAME OVER 💀\n" + causaPerder + "\n\n🎯 Puntaje final: " + puntaje + "\n\nPresiona Reiniciar para intentarlo de nuevo 😉");
        break;
      default:
        break;
    }
    msgPuntaje = puntaje;
    cmpDescripcion.innerText = msgDescripcion;
    cmpPuntaje.value = msgPuntaje;
    cmpEstado.innerText = msgEstado;
    cmpMensaje.innerText = msgMensaje;
  }
}