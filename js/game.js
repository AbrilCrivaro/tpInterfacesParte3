
const botonCompartir = seleccionar('#boton-compartir');

if (botonCompartir) {
    botonCompartir.onclick = () => {
        navigator.clipboard?.writeText(location.href).catch(() => {});
        mostrarAviso('¡Enlace copiado!', 'Compartí ' + seleccionar('h1').textContent + ' con tus amigos.');
    };
}

const campoComentario = seleccionar('#campo-comentario');

seleccionar('#formulario-comentario').onsubmit = evento => {
    evento.preventDefault();

   
    const textoComentario = campoComentario.value.trim();
    const error = textoComentario.length < 3 ? 'Escribí al menos 3 caracteres.' : '';
    if (!validarCampo(campoComentario, error)) return;

    
    const comentarioNuevo = seleccionar('#molde-comentario').content.firstElementChild.cloneNode(true);
    seleccionar('small', comentarioNuevo).textContent = NOMBRE_USUARIO + ' · Recién';
    seleccionar('span', comentarioNuevo).textContent = textoComentario;

    seleccionar('.comentarios').prepend(comentarioNuevo); 
    campoComentario.value = '';                         
    mostrarAviso('¡Gracias por participar!', 'Tu comentario fue publicado como ' + NOMBRE_USUARIO + '.');
};
