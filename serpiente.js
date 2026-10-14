
// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

const TAMANIO_CELDA = 25;

const COLOR_CUADRICULA = "#1f1f3d";
const COLOR_PARTE = "#10b981";
const COLOR_BORDE_PARTE = "#34d399";


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
  pintarParte(5, 5);
  pintarParte(10, 2);
  pintarParte(10, canvas.height/TAMANIO_CELDA - 1);
  pintarParte(canvas.width/TAMANIO_CELDA - 1, 10);
  pintarParte(0, 10);
  pintarParte(canvas.width/TAMANIO_CELDA - 1, canvas.height/TAMANIO_CELDA - 1);
}

function dibujarTablero() {
  ctx.strokeStyle = COLOR_CUADRICULA;

  for (let i = 0; i < canvas.width; i += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

function pintarParte(lineaX, lineaY) {
  ctx.fillStyle = COLOR_PARTE;
  ctx.fillRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA)
  ctx.strokeStyle = COLOR_BORDE_PARTE;
  ctx.strokeRect(TAMANIO_CELDA * lineaX, TAMANIO_CELDA * lineaY, TAMANIO_CELDA, TAMANIO_CELDA);
}



