
// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

const COLOR_CUADRICULA = "#1f1f3d";
const COLOR_PARTE = "#10b981";
const COLOR_BORDE_PARTE = "#34d399";
const COLOR_CABEZA = "#facc15";
const COLOR_BORDE_CABEZA = "#b45309";

const serpiente = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];

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
}

function dibujarTablero() {
  ctx.strokeStyle = COLOR_CUADRICULA;
  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i += TAMANIO_CELDA) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i <= canvas.height; i += TAMANIO_CELDA) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);

  }
  ctx.stroke();
}

function pintarParte(lineaX, lineaY) {
  ctx.fillStyle = COLOR_PARTE;
  ctx.fillRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA)
  ctx.strokeStyle = COLOR_BORDE_PARTE;
  ctx.strokeRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarCabeza() {
  ctx.fillStyle = COLOR_CABEZA;
  ctx.fillRect(TAMANIO_CELDA * serpiente[0].x, TAMANIO_CELDA * serpiente[0].y, TAMANIO_CELDA, TAMANIO_CELDA);
  ctx.strokeStyle = COLOR_BORDE_CABEZA;
  ctx.strokeRect(TAMANIO_CELDA * serpiente[0].x, TAMANIO_CELDA * serpiente[0].y, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
  for (let i = 1; i < serpiente.length; i++) {
    pintarParte(serpiente[i].x, serpiente[i].y);
  }
  pintarCabeza();
}