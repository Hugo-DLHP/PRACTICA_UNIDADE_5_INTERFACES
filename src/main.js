const juego = document.getElementById("juego")
const marcador = document.getElementById("marcador")
const gameover = document.getElementById("gameover")


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

let objetivo_puntos = 2250;

let intervaloDeJuego;

const aumentarMarcador = () => {
    marcador.innerText = puntos;
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

function dibujarComida() {
    ctx.beginPath()
    ctx.rect(comida.posX, comida.posY, 10, 10)
    ctx.stroke()
}

function dibujaCoso() {
    for (let unidadDeCoso of coso) {
        ctx.beginPath()
        ctx.rect(unidadDeCoso.posX, unidadDeCoso.posY, 10, 10)
        ctx.stroke()
    }
}

function ajustarPosicion() {
    if (direccion === DIRECCIONES.DERECHA) cabezaPosX +=10;
    else if (direccion === DIRECCIONES.IZQUIERDA) cabezaPosX -=10;
    else if (direccion === DIRECCIONES.ABAJO) cabezaPosY +=10;
    else if (direccion === DIRECCIONES.ARRIBA) cabezaPosY -=10;
    else throw new Error("La dirección tiene un valor inválido asignado");

    coso.unshift({ posX: cabezaPosX, posY: cabezaPosY })
    coso.pop()
}

function agregarUnidadACoso() {
    let direccionUltimaUnidad 
    let ultimaUnidad

    if (coso.length === 1) {
        direccionUltimaUnidad = direccion
        ultimaUnidad = coso[0]
    } else {
        ultimaUnidad = coso[coso.length - 1]
        let penultimaUnidad = coso[coso.length - 2]

        let diferenciaX = penultimaUnidad.posX - ultimaUnidad.posX
        let diferenciaY = penultimaUnidad.posY - ultimaUnidad.posY

        if (diferenciaX > 0) {
            direccionUltimaUnidad = DIRECCIONES.DERECHA
        } else if (diferenciaX < 0) {
            direccionUltimaUnidad = DIRECCIONES.IZQUIERDA
        } else if (diferenciaY > 0) {
            direccionUltimaUnidad = DIRECCIONES.ABAJO
        } else if (diferenciaY <0) {
            direccionUltimaUnidad = DIRECCIONES.ARRIBA
        }
    }

    switch(direccionUltimaUnidad) {
        case DIRECCIONES.ARRIBA:
            nuevaUnidad = { posX: ultimaUnidad.posX, posY: ultimaUnidad.posY + 10 }
            break;
        case DIRECCIONES.ABAJO:
            nuevaUnidad = { posX: ultimaUnidad.posX, posY: ultimaUnidad.posY - 10 }
            break;
        case DIRECCIONES.DERECHA:
            nuevaUnidad = { posX: ultimaUnidad.posX + 10, posY: ultimaUnidad.posY }
            break;
        case DIRECCIONES.IZQUIERDA:
            nuevaUnidad = { posX: ultimaUnidad.posX - 10, posY: ultimaUnidad.posY }
            break;
    }

    coso.push(nuevaUnidad)
}

function revisarColisiones() {
    if (cabezaPosX < 0 || cabezaPosY < 0 || cabezaPosX >= mapWidth || cabezaPosY >= mapHeight) {
        console.log("Has chocado con la pared!")
        gameOver()
    }

    if (posicionesDeCoso.size !== coso.length) {
        console.log("Has chocado contigo mismo!")
        gameOver()
    }

    if (posicionesDeCoso.has(`${comida.posX}${comida.posY}`)) {
        comida = crearComida()
        incrementarPuntos()
        agregarUnidadACoso()

    }
}

const direccionEventos = e => {
    if (e.code === "ArrowUp" && direccion !== DIRECCIONES.ABAJO) {
        direccion = DIRECCIONES.ARRIBA
    } else if (e.code === "ArrowDown" && direccion !== DIRECCIONES.ARRIBA) {
        direccion = DIRECCIONES.ABAJO
    } else if (e.code === "ArrowLeft" && direccion !== DIRECCIONES.DERECHA) {
        direccion = DIRECCIONES.IZQUIERDA
    } else if (e.code === "ArrowRight" && direccion !== DIRECCIONES.IZQUIERDA) {
        direccion = DIRECCIONES.DERECHA
    }
}

function actualizarPosicionesDeCoso() {
    posicionesDeCoso = new Set()
    coso.forEach(unidadDeCoso => posicionesDeCoso.add(`${unidadDeCoso.posX}${unidadDeCoso.posY}`))
}


function gameLoop() {
    limpiarCanvas()
    ajustarPosicion()
    actualizarPosicionesDeCoso()
    dibujaCoso()
    dibujarComida()
    revisarColisiones()
}

function incrementarPuntos() {
    puntos++
    aumentarMarcador()
}

function limpiarCanvas() {
    ctx.clearRect(0, 0, juego.clientWidth, juego.height);
}

function setGame() {
    puntos = 0;
    coso.length = 1;
    marcador.innerText = puntos;
    cabezaPosX = 10;
    cabezaPosY = 10;
    direccion = DIRECCIONES.DERECHA
    gameover.style.animation = 'none';
}

const startGame = () => {
    setGame()
    gameLoop()
    document.addEventListener('keyup', direccionEventos);
    intervaloDeJuego = setInterval(gameLoop, FPS);
}

function gameOver() {
    clearInterval(intervaloDeJuego)
    limpiarCanvas()
    gameover.style.animation = 'zoomIn 2.7s linear forwards';
}