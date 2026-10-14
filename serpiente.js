
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
// Primera pintura del juego al cargar la página
dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================

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
  direccionActual = direccion;
}

function iniciarJuego() {
  if (intervaloSerpiente !== null) return;
  intervaloSerpiente = setInterval(moverSerpiente, 1000);
}

function pausarJuego() {
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
}

function moverSerpiente() {
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
    puntaje += 1;
    let cmpPuntaje = document.getElementById("puntaje");
    cmpPuntaje.innerText = puntaje; 
  }
}

function pintarComida() {
  pintarParte(comida.x, comida.y, COLOR_COMIDA, COLOR_BORDE_COMIDA);
}

function generarComida() {
  comida.x = numeroAleatorio(0, canvas.width / TAMANIO_CELDA - 1);
  comida.y = numeroAleatorio(0, canvas.height / TAMANIO_CELDA - 1);
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
  let nueva_cola = {x:cola.x,y:cola.y};
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