
const seleccionar = (selector, dentroDe = document) => dentroDe.querySelector(selector);
const seleccionarTodos = (selector, dentroDe = document) => [...dentroDe.querySelectorAll(selector)];


const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NOMBRE_USUARIO = localStorage.getItem('sg_usuario') || 'Spidey';


let temporizadorAviso; 


function mostrarAviso(titulo, texto) {
    const aviso = seleccionar('#aviso');
    if (!aviso) return; 

    seleccionar('b', aviso).textContent = titulo;
    seleccionar('span', aviso).textContent = texto;

   
    aviso.classList.remove('visible');
    void aviso.offsetWidth; 
    aviso.classList.add('visible');

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 4000);
}


seleccionar('#aviso button')?.addEventListener('click', () => {
    seleccionar('#aviso').classList.remove('visible');
});


function validarCampo(campoInput, mensajeError) {
    const campo = campoInput.closest('.campo'); 
    campo.classList.toggle('con-error', Boolean(mensajeError)); 
    seleccionar('.campo-mensaje', campo).textContent = mensajeError || '';
    return !mensajeError;
}


seleccionarTodos('[data-nombre-usuario]').forEach(elemento => {
    elemento.textContent = NOMBRE_USUARIO;
});


const menuLateral = seleccionar('#menu-lateral');
const fondoOscuro = seleccionar('#fondo-oscuro-menu');
const menuPerfil = seleccionar('#menu-perfil');
const botonMenu = seleccionar('#boton-menu-lateral');


if (menuLateral) {

    // abre (true) o cierra (false) el menú lateral
    function cambiarMenuLateral(abrir) {
        menuLateral.classList.toggle('abierto', abrir);
        botonMenu.classList.toggle('abierto', abrir);                     
        botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    }

    botonMenu.onclick = evento => {
    evento.stopPropagation();
    const estaAbierto = menuLateral.classList.contains('abierto');
    cambiarMenuLateral(!estaAbierto);
    };


    
    seleccionar('#boton-perfil').onclick = evento => {
        evento.stopPropagation(); 
        menuPerfil.classList.toggle('visible');
    };

    
    document.addEventListener('click', evento => {
        
       
        if (!menuPerfil.contains(evento.target)) {
            menuPerfil.classList.remove('visible');
        }

        
        if (!menuLateral.contains(evento.target)) {
            cambiarMenuLateral(false);
        }
    });
    
    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') {
            cambiarMenuLateral(false);
            menuPerfil.classList.remove('visible');
        }
    });

    
    const campoBusqueda = seleccionar('#campo-busqueda');
    const listaResultados = seleccionar('#lista-resultados');
    const moldeResultado = seleccionar('#molde-resultado-busqueda'); 
    const mensajeSinResultados = seleccionar('#mensaje-sin-resultados');

    
    campoBusqueda.oninput = () => {
        const textoBuscado = campoBusqueda.value.trim().toLowerCase();

        
        seleccionarTodos('a[data-juego]', listaResultados).forEach(resultado => resultado.remove());

        
        const juegosEncontrados = textoBuscado
            ? Object.entries(JUEGOS).filter(([, juego]) => juego.titulo.toLowerCase().includes(textoBuscado))
            : [];

        
        juegosEncontrados.forEach(([idJuego, juego]) => {
            const resultado = moldeResultado.content.firstElementChild.cloneNode(true);
            resultado.dataset.juego = idJuego;
            resultado.href = juego.url || '#';
            seleccionar('img', resultado).src = juego.imagen;
            seleccionar('span', resultado).textContent = juego.titulo;
            listaResultados.insertBefore(resultado, mensajeSinResultados);
        });

        
        mensajeSinResultados.hidden = !textoBuscado || juegosEncontrados.length > 0;
        listaResultados.classList.toggle('visible', Boolean(textoBuscado));
    };

    
    listaResultados.onclick = evento => {
        const resultado = evento.target.closest('a[data-juego]');
        if (resultado && !JUEGOS[resultado.dataset.juego].url) {
            evento.preventDefault(); 
            mostrarAviso(JUEGOS[resultado.dataset.juego].titulo, 'Este juego llega pronto a la red');
        }
    };
}
