

function iniciarCarrusel(carrusel, indiceInicial = 2) {
    const ANCHOS = [260, 206, 170]; // ancho segun la distancia a la tarjeta activa 
    const pista = seleccionar('.carrusel-pista', carrusel);       
    const flechaAnterior = seleccionar('.flecha-anterior', carrusel);
    const flechaSiguiente = seleccionar('.flecha-siguiente', carrusel);

    const tarjetasOriginales = seleccionarTodos('.tarjeta-juego', pista);
    const cantidad = tarjetasOriginales.length;   

    function copiarTarjetas() {
        return tarjetasOriginales.map(tarjeta => {
            const copia = tarjeta.cloneNode(true);
            copia.setAttribute('aria-hidden', 'true'); 
            return copia;
        });
    }
    pista.prepend(...copiarTarjetas());  
    pista.append(...copiarTarjetas());  

    const tarjetas = seleccionarTodos('.tarjeta-juego', pista); 

    let indiceActivo = cantidad + indiceInicial;
    let posicionInicialToque = null;  


    function posicionar(sinAnimacion = false) {
        if (sinAnimacion) carrusel.classList.add('sin-transicion');

        const anchoSegunDistancia = distancia => ANCHOS[Math.min(distancia, 2)];
        const separacion = parseFloat(getComputedStyle(pista).columnGap) || 0;

        // borde izquierdo de la tarjeta activa: suma de lo que ocupan las tarjetas anteriores
        let izquierda = 0;
        for (let i = 0; i < indiceActivo; i++) {
            izquierda += anchoSegunDistancia(indiceActivo - i) + separacion;
        }

        const centroDelCarrusel = carrusel.clientWidth / 2;
        const centroDeLaTarjeta = izquierda + ANCHOS[0] / 2;
        pista.style.transform = `translateX(${centroDelCarrusel - centroDeLaTarjeta}px)`;

  
        tarjetas.forEach((tarjeta, posicion) => {
            const distancia = Math.abs(posicion - indiceActivo);
            tarjeta.classList.toggle('activa', distancia === 0);
            tarjeta.classList.toggle('vecina', distancia === 1);
            tarjeta.classList.toggle('lejana', distancia >= 2);
        });

        if (sinAnimacion) {
            void pista.offsetWidth; 
            carrusel.classList.remove('sin-transicion');
        }
    }

    function volverAlMedio() {
        if (indiceActivo < cantidad) {
            indiceActivo += cantidad;
            posicionar(true);
        } else if (indiceActivo >= cantidad * 2) {
            indiceActivo -= cantidad;
            posicionar(true);
        }
    }


    function moverATarjeta(nuevoIndice) {
        const desplazamiento = nuevoIndice - indiceActivo;
        volverAlMedio();
        indiceActivo += desplazamiento;
        posicionar();
    }

    pista.addEventListener('transitionend', evento => {
        if (evento.target === pista && evento.propertyName === 'transform') volverAlMedio();
    });

    flechaAnterior.onclick = () => moverATarjeta(indiceActivo - 1);
    flechaSiguiente.onclick = () => moverATarjeta(indiceActivo + 1);


    tarjetas.forEach((tarjeta, posicion) => {
        tarjeta.addEventListener('click', evento => {

            if (posicion !== indiceActivo) {
                evento.preventDefault();
                moverATarjeta(posicion);
                return;
            }

            const boton = evento.target.closest('a[data-juego]');
            if (!boton) return;

            const juego = JUEGOS[boton.dataset.juego];
            if (juego.url) return; // red aracnida

            evento.preventDefault();
            if (boton.dataset.premium) {
                mostrarAviso(juego.titulo + ' es premium', 'Hazte premium para jugarlo.');
            } else {
                mostrarAviso(juego.titulo, 'Este juego llega pronto a la red.');
            }
        });
    });

    carrusel.addEventListener('pointerdown', evento => {
        posicionInicialToque = evento.clientX;
    });
    carrusel.addEventListener('pointerup', evento => {
        if (posicionInicialToque !== null && Math.abs(evento.clientX - posicionInicialToque) > 50) {
            const fueHaciaLaIzquierda = evento.clientX < posicionInicialToque;
            moverATarjeta(indiceActivo + (fueHaciaLaIzquierda ? 1 : -1));
        }
        posicionInicialToque = null;
    });

    addEventListener('resize', () => posicionar(true));

    posicionar(true); // posición inicial, sin deslizar desde el borde
}

seleccionarTodos('.carrusel').forEach(carrusel => iniciarCarrusel(carrusel));