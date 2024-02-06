const juego = document.getElementById("juego")
const marcador = document.getElementById("puntos")


const ctx = juego.getContext("2d")

const DIRECCIONES = {
    ARRIBA: 1,
    ABAJO: 2,
    IZQUIERDA: 3,
    DERECHA: 4
}

const FPS = 1000 / 10

const mapWidth = 370

const mapHeight = 280

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