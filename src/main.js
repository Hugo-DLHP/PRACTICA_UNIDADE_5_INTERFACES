const juego = document.getElementById("juego")
const marcador = document.getElementById("marcador")
const start = document.getElementById("start")


const ctx = juego.getContext("2d")

const DIRECCIONES = {
    ARRIBA: 1,
    ABAJO: 2,
    IZQUIERDA: 3,
    DERECHA: 4
}

const FPS = 1000 / 10

const mapWidth = 500

const mapHeight = 450

let direccion = DIRECCIONES.DERECHA
let cabezaPosX = 10, cabezaPosY = 10

let coso = [
    { posX: 10, posY: 10 }
]

let posicionesDeCoso = new Set()

let comida = crearComida()

let puntos = 0

let objetivo_puntos = 0;

let intervaloDeJuego;

const aumentarMarcador = () => {
    marcador.innerText = puntos;
}

function dibujarComida() {
    ctx.beginPath()
    ctx.rect(comida.posX, comida.posY, 10, 10)
    ctx.stroke()
}

function crearComida() {
    let min = Math.ceil(5);
    let max = Math.floor(25);
    let posX = (Math.floor(Math.random() * (max - min)) + min) * 10
    let posY = (Math.floor(Math.random() * (max - min)) + min) * 10

    if (posicionesDeCoso.has(`${posX}${posY}`)) {
        return crearComida()
    }

    return { posX, posY }
}

function setGame() {
    puntos = 0;
    coso.length = 1;
    marcador.innerText = puntos;
    cabezaPosX = 10;
    cabezaPosY = 10;
    direccion = DIRECCIONES.DERECHA
}

const startGame = () => {
    setGame()
    gameLoop()
    document.addEventListener('keyup', direccionEventos);
    intervaloDeJuego = setInterval(gameLoop, FPS);
}

start.addEventListener('click', startGame)