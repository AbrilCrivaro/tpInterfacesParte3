
// banco de imagenes, una al azar
const BANCO = [1, 2, 3, 4, 5, 6].map(n => `assets/blocka/blocka-${n}.jpg`);

// un filtro por nivel. Si es un arreglo, cada pieza tiene un filtro distinto.
const NIVELES = [
    { nombre: 'Escala de grises',   filtro: 'grises',   tiempoMax: null },
    { nombre: 'Brillo +30%',        filtro: 'brillo',   tiempoMax: 35 },
    { nombre: 'Negativo',           filtro: 'negativo', tiempoMax: 25 },
    { nombre: 'Filtros mezclados',  filtro: ['negativo', 'grises', 'brillo', 'negativo'], tiempoMax: 15 }
];

//   anchoTablero: mas piezas, mas ancho, factor tiempo, mas piezas mas tiempo maximo
const CONFIGURACIONES = {
    4: { columnas: 2, filas: 2, anchoTablero: 640, factorTiempo: 1 },
    6: { columnas: 3, filas: 2, anchoTablero: 800, factorTiempo: 1.5 },
    8: { columnas: 4, filas: 2, anchoTablero: 960, factorTiempo: 2 }
};

const TAM = 320;                                // lado de cada pieza, en pixeles del canvas
const ROTACIONES_INICIALES = [90, 180, 270];    
const PENALIZACION_AYUDITA_MS = 5000;           
const AVISO_URGENTE_MS = 10000;                 // los ultimos 10 segundos el tiempo se pone en rojo

/* cada funcion recibe data y la posición i del R del pixel */
const FILTROS = {
    // BT.601
    grises: (data, i) => {
        const gris = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gris;
    },
    // +30%: se multiplica cada canal por 1,3 
    brillo: (data, i) => {
        data[i] *= 1.3;
        data[i + 1] *= 1.3;
        data[i + 2] *= 1.3;
    },
    
    negativo: (data, i) => {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};

const lienzo = seleccionar('#blocka-lienzo');
const ctx = lienzo.getContext('2d');

const panelJuego = seleccionar('.blocka-juego');
const capa = seleccionar('#blocka-capa');
const textoNivel = seleccionar('#blocka-nivel');
const textoFiltro = seleccionar('#blocka-filtro');
const textoTiempo = seleccionar('#blocka-tiempo');
const textoRecord = seleccionar('#blocka-record');
const textoLimite = seleccionar('#blocka-limite');
const botonAyudita = seleccionar('#blocka-ayudita');
const opcionesPiezas = seleccionarTodos('.blocka-opcion');

let cantidadPiezas = Number(localStorage.getItem('blocka-piezas'));   // la ultima elección queda guardada
if (!CONFIGURACIONES[cantidadPiezas]) cantidadPiezas = 4;
let columnas = CONFIGURACIONES[cantidadPiezas].columnas;
let filas = CONFIGURACIONES[cantidadPiezas].filas;

let nivel = 0;                 // indice del nivel actual
let estado = 'esperando';      // 'esperando' (antes de Comenzar) , 'jugando' , 'terminado' , 'perdido'
let piezas = [];               // [{ col, fila, rotacion, fija }]
let imagenActual = null;       // imagen ya cargada del nivel (para rearmarlo si cambian las piezas)
let fuenteOriginal;            // canvas con la imagen original
let fuenteFiltrada;            // canvas con los filtros aplicados
let idCarga = 0;               // identifica cada carga de nivel 
let momentoInicio = 0;
let penalizacion = 0;          
let reloj = null;

function cargarNivel() {
    detenerReloj();
    estado = 'esperando';
    penalizacion = 0;
    imagenActual = null;
    const miCarga = ++idCarga;
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

    actualizarHUD();
    actualizarAyudita();
    actualizarOpciones();
    mostrarCapa('Nivel ' + (nivel + 1), 'eligiendo imagen...');

    // imagen elegida al azar 
    const elegida = BANCO[Math.floor(Math.random() * BANCO.length)];

    // cargar una imagen se envuelve en una promesa 
    const carga = new Promise((resolver, rechazar) => {
        const imagen = new Image();
        imagen.onload = function () { resolver(this); };      
        imagen.onerror = rechazar;
        imagen.src = elegida;                                 
    });

    // el nivel arranca cuando terminaron las dos cosas: la imagen cargo y la animación del sorteo.
    Promise.all([carga, animarSorteo(BANCO.indexOf(elegida), miCarga)])
        .then(([imagen]) => {
            if (miCarga !== idCarga) return;
            imagenActual = imagen;
            armarNivel(imagen);
            mostrarCapa('Nivel ' + (nivel + 1),
                'Filtro: ' + NIVELES[nivel].nombre + '. Clic izquierdo: gira la pieza a la izquierda · Clic derecho: gira a la derecha.',
                [{ texto: 'Comenzar', accion: comenzar }]);
        })
        .catch(error => {
            if (miCarga !== idCarga) return;
            console.error(error);
            mostrarCapa('No se pudo preparar el nivel');
        });
}

function armarNivel(imagen) {
    aplicarConfiguracion();
    fuenteOriginal = ajustarImagen(imagen, columnas * TAM, filas * TAM);

    piezas = [];
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const rotacion = ROTACIONES_INICIALES[Math.floor(Math.random() * ROTACIONES_INICIALES.length)];
            piezas.push({ col, fila, rotacion });
        }
    }

    fuenteFiltrada = aplicarFiltros(fuenteOriginal, NIVELES[nivel].filtro);
    dibujar();
}

// ajusta el canvas y el ancho del tablero a la cantidad de piezas elegida
function aplicarConfiguracion() {
    const config = CONFIGURACIONES[cantidadPiezas];
    columnas = config.columnas;
    filas = config.filas;
    lienzo.width = columnas * TAM;      
    lienzo.height = filas * TAM;
    panelJuego.style.setProperty('--ancho-tablero', config.anchoTablero + 'px');
}

// recorta la imagen al centro y la deja exactamente de ancho por alto
function ajustarImagen(imagen, ancho, alto) {
    const aux = document.createElement('canvas');
    aux.width = ancho;
    aux.height = alto;

    const escala = Math.max(ancho / imagen.width, alto / imagen.height);
    const anchoOrigen = ancho / escala;
    const altoOrigen = alto / escala;
    const xOrigen = (imagen.width - anchoOrigen) / 2;
    const yOrigen = (imagen.height - altoOrigen) / 2;

    aux.getContext('2d').drawImage(imagen, xOrigen, yOrigen, anchoOrigen, altoOrigen, 0, 0, ancho, alto);
    return aux;
}

// canvas nuevo con el filtro aplicado pieza por pieza
function aplicarFiltros(fuente, filtro) {
    const aux = document.createElement('canvas');
    aux.width = fuente.width;
    aux.height = fuente.height;
    const auxCtx = aux.getContext('2d');
    auxCtx.drawImage(fuente, 0, 0);

    piezas.forEach((pieza, indice) => {
        const nombre = Array.isArray(filtro) ? filtro[indice % filtro.length] : filtro;
        const x = pieza.col * TAM;
        const y = pieza.fila * TAM;

        const imageData = auxCtx.getImageData(x, y, TAM, TAM);   // copia de los pixeles en memoria
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) FILTROS[nombre](data, i);
        auxCtx.putImageData(imageData, x, y);                    // cambia el canvas
    });
    return aux;
}

/* se dibuja desde un canvas auxiliar con drawImage (y no con putImageData) porque putImageData ignora rotate(): no giraria */
function dibujar() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    const fuente = estado === 'terminado' ? fuenteOriginal : fuenteFiltrada;   // al ganar sin filtros

    piezas.forEach(pieza => {
        ctx.save();
        ctx.translate(pieza.col * TAM + TAM / 2, pieza.fila * TAM + TAM / 2);  // origen al centro de la celda
        ctx.rotate(pieza.rotacion * Math.PI / 180);                            // gira alrededor de ese centro
        ctx.drawImage(fuente,
            pieza.col * TAM, pieza.fila * TAM, TAM, TAM, 
            -TAM / 2, -TAM / 2, TAM, TAM);                 
        ctx.restore();
    });

    if (estado !== 'terminado') {
        dibujarDivisiones();
        marcarPiezasFijas();
    }
}

// borde violeta en las piezas fijas
function marcarPiezasFijas() {
    ctx.strokeStyle = '#9B86FF';
    ctx.lineWidth = 8;
    piezas.filter(pieza => pieza.fija).forEach(pieza => {
        ctx.strokeRect(pieza.col * TAM + 4, pieza.fila * TAM + 4, TAM - 8, TAM - 8);
    });
}

function dibujarDivisiones() {
    ctx.strokeStyle = '#0C0D14';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let c = 1; c < columnas; c++) { ctx.moveTo(c * TAM, 0); ctx.lineTo(c * TAM, lienzo.height); }
    for (let f = 1; f < filas; f++) { ctx.moveTo(0, f * TAM); ctx.lineTo(lienzo.width, f * TAM); }
    ctx.stroke();
}

lienzo.addEventListener('contextmenu', evento => evento.preventDefault());   // cancela el menu del click derecho

lienzo.addEventListener('mousedown', evento => {
    if (estado !== 'jugando') return;

    // convierte el clic a pixceles del canvas
    const caja = lienzo.getBoundingClientRect();
    const x = (evento.clientX - caja.left) * lienzo.width / caja.width;
    const y = (evento.clientY - caja.top) * lienzo.height / caja.height;
    const col = Math.floor(x / TAM); //calcula que pieza se toco
    const fila = Math.floor(y / TAM); 

    const pieza = piezas.find(p => p.col === col && p.fila === fila); //busca la pieza
    if (!pieza || pieza.fija) return;      // si es fija no hace nada

    // en canva los angulos positivos giran a la derecha
    if (evento.button === 0) pieza.rotacion = (pieza.rotacion + 270) % 360;      // izquierda -90
    else if (evento.button === 2) pieza.rotacion = (pieza.rotacion + 90) % 360;  // derecha +90 
    else return;

    dibujar();
    actualizarAyudita();
    if (piezas.every(pieza => pieza.rotacion === 0)) ganar(); //si todas las rotaciones son 0
});

botonAyudita.addEventListener('click', usarAyudita);
opcionesPiezas.forEach(opcion => {
    opcion.addEventListener('click', () => cambiarPiezas(Number(opcion.dataset.piezas)));
});

function comenzar() {
    estado = 'jugando';
    capa.hidden = true;
    momentoInicio = performance.now();
    penalizacion = 0;
    reloj = setInterval(actualizarReloj, 100);
    actualizarAyudita();
    actualizarOpciones();
}

// tiempo que lleva el jugador, reloj real + penalizaciones de las ayuditas 
function transcurrido() {
    return performance.now() - momentoInicio + penalizacion;
}

// tiempo maximo del nivel, ajustado a la cantidad de piezas
function limiteActual() {
    const base = NIVELES[nivel].tiempoMax;
    return base ? Math.round(base * CONFIGURACIONES[cantidadPiezas].factorTiempo) : null;
}

//   muestra el tiempo y controla el limite 
function actualizarReloj() {
    const ms = transcurrido();
    textoTiempo.textContent = formatear(ms);

    const limite = limiteActual();
    if (!limite) return;                                                   
    textoTiempo.classList.toggle('urgente', limite * 1000 - ms <= AVISO_URGENTE_MS);
    if (ms >= limite * 1000) perder();
}

function perder() {
    if (estado !== 'jugando') return;
    detenerReloj();
    estado = 'perdido';
    const limite = formatear(limiteActual() * 1000);
    textoTiempo.textContent = limite;
    dibujar();
    actualizarAyudita();
    actualizarOpciones();
    mostrarCapa('¡Se acabó el tiempo!',
        'No alcanzaste a reconstruir la imagen en ' + limite + '. Probá de nuevo.', [
        { texto: 'Reintentar nivel', accion: cargarNivel },
        { texto: 'Menú principal', href: 'index.html', secundario: true }
    ]);
}

function ganar() {
    const duracion = transcurrido();
    detenerReloj();
    estado = 'terminado';
    textoTiempo.classList.remove('urgente');
    textoTiempo.textContent = formatear(duracion);
    actualizarAyudita();
    actualizarOpciones();
    dibujar();                                    // imagen original, sin filtros ni divisiones

    // record por nivel y por cantidad de piezas, guardado local
    const anterior = Number(localStorage.getItem(claveRecord()));
    const esRecord = !anterior || duracion < anterior;
    if (esRecord) localStorage.setItem(claveRecord(), Math.round(duracion));
    textoRecord.textContent = leerRecord();

    const mensaje = 'Tiempo: ' + formatear(duracion) + (esRecord ? ' · ¡Nuevo récord!' : '');
    const menuPrincipal = { texto: 'Menú principal', href: 'index.html', secundario: true };

    if (nivel < NIVELES.length - 1) {
        mostrarCapa('¡Imagen completa!', mensaje, [
            { texto: 'Siguiente nivel', accion: () => { nivel++; cargarNivel(); } },
            menuPrincipal
        ], true);
    } else {
        mostrarCapa('¡Completaste todos los niveles!', mensaje, [
            { texto: 'Volver a empezar', accion: () => { nivel = 0; cargarNivel(); } },
            menuPrincipal
        ], true);
    }
}

function piezasPendientes() {
    return piezas.filter(pieza => !pieza.fija && pieza.rotacion !== 0);
}

function actualizarAyudita() {
    botonAyudita.disabled = estado !== 'jugando' || piezasPendientes().length < 2;
}
//solo se puede usar si quedan al menos 2 piezas por resolver
function usarAyudita() {
    if (estado !== 'jugando') return;
    const pendientes = piezasPendientes();
    if (pendientes.length < 2) return;

    const elegida = pendientes[Math.floor(Math.random() * pendientes.length)];
    elegida.rotacion = 0;
    elegida.fija = true;
    penalizacion += PENALIZACION_AYUDITA_MS;

    dibujar();
    actualizarReloj();            // actualiza el tiempo y revisa si la penalizacion llego al limite de tiempo
    actualizarAyudita();
    mostrarAviso('¡Ayudita!', 'Una pieza quedó en su lugar y fija. +5 segundos.');
}
//solo se puede cambiar la cantidad de piezas antes de empezar el nivel, estado esperando
function cambiarPiezas(cantidad) {
    if (estado !== 'esperando' || cantidad === cantidadPiezas || !CONFIGURACIONES[cantidad]) return;
    cantidadPiezas = cantidad;
    localStorage.setItem('blocka-piezas', cantidad);

    aplicarConfiguracion();
    actualizarHUD();
    actualizarOpciones();
    if (imagenActual) armarNivel(imagenActual);
}

function actualizarOpciones() {
    opcionesPiezas.forEach(opcion => {
        opcion.setAttribute('aria-pressed', Number(opcion.dataset.piezas) === cantidadPiezas);
        opcion.disabled = estado !== 'esperando';
    });
}

function crearSorteo() {
    const contenedor = document.createElement('div');
    contenedor.className = 'blocka-sorteo';
    contenedor.hidden = true;
    BANCO.forEach(ruta => {
        const miniatura = document.createElement('img');
        miniatura.src = ruta;
        miniatura.alt = '';                       
        contenedor.append(miniatura);
    });
    seleccionar('#blocka-capa-botones').before(contenedor); //inserta antes del contenedor de botones 
    return contenedor;
}

const sorteo = crearSorteo();

function animarSorteo(indiceFinal, miCarga) {
    return new Promise(resolver => {   //cargarNivel espera este aviso junto con la carga de la imagen antes de mostrar comenzar
        const miniaturas = [...sorteo.children];
        miniaturas.forEach(miniatura => miniatura.classList.remove('resaltada', 'elegida'));
        sorteo.classList.remove('terminado');
        sorteo.hidden = false;

        const pasos = BANCO.length + indiceFinal;      // una vuelta completa mas lo necesario para llegar a la imagen que salio
        let paso = 0;

        (function siguiente() {
            if (miCarga !== idCarga) return;           // si arranco otra carga, esta se descarta
            miniaturas.forEach((miniatura, i) => miniatura.classList.toggle('resaltada', i === paso % BANCO.length));

            if (paso === pasos) {                      // llego a la elegida: se queda marcada
                miniaturas[indiceFinal].classList.add('elegida');
                sorteo.classList.add('terminado');
                setTimeout(resolver, 1000);
                return;
            }
            const demora = 350;    
            paso++;
            setTimeout(siguiente, demora);
        })();
    });
}


function detenerReloj() {
    clearInterval(reloj);
    reloj = null;
}

// pone en el hgud los datos del nivel actual, nivel, filtro, tiempo, limite, record
function actualizarHUD() {
    textoNivel.textContent = (nivel + 1) + ' / ' + NIVELES.length;
    textoFiltro.textContent = NIVELES[nivel].nombre;
    textoTiempo.textContent = formatear(0);
    textoTiempo.classList.remove('urgente');
    textoLimite.textContent = limiteActual() ? formatear(limiteActual() * 1000) : '--';
    textoRecord.textContent = leerRecord();
}

// ms -> "mm:ss.d"
function formatear(ms) {
    const decimas = Math.floor(ms / 100);
    const min = Math.floor(decimas / 600);
    const seg = Math.floor(decimas / 10) % 60;
    return String(min).padStart(2, '0') + ':' + String(seg).padStart(2, '0') + '.' + (decimas % 10);
}

// un record distinto por nivel y cantidad de piezad
function claveRecord() {
    return 'blocka-record-' + cantidadPiezas + 'p-nivel-' + (nivel + 1);
}

function leerRecord() {
    const guardado = Number(localStorage.getItem(claveRecord()));
    return guardado ? formatear(guardado) : '--';
}

// cartel sobre el tablero
function mostrarCapa(titulo, texto, botones = [], ligera = false) {
    capa.hidden = false;
    capa.classList.toggle('ligera', ligera);
    sorteo.hidden = true;                          // las miniaturas solo se ven durante el sorteo
    seleccionar('#blocka-capa-titulo').textContent = titulo;
    seleccionar('#blocka-capa-texto').textContent = texto;

    const contenedor = seleccionar('#blocka-capa-botones');
    contenedor.replaceChildren();   // sin nada adentro, vacia el contenedor
    botones.forEach(datos => { 
        const boton = document.createElement(datos.href ? 'a' : 'button');   // crea un a enlace o un button
        boton.className = 'boton ' + (datos.secundario ? 'boton-secundario' : 'boton-primario boton-grande'); // le pone estilo secundario o primario
        boton.textContent = datos.texto; 
        if (datos.href) boton.href = datos.href; //si es enlace a donde va o si es boton que hace
        else boton.onclick = datos.accion;
        contenedor.append(boton);
    });
}

aplicarConfiguracion();
actualizarOpciones();
cargarNivel();
