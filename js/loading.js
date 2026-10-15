
const pantallaCarga = seleccionar('#pantalla-carga');

if (pantallaCarga) {
    const DURACION_CARGA_MS = 5000; 
    const anilloCarga = seleccionar('.carga-anillo');
    const textoPorcentaje = seleccionar('#carga-porcentaje');
    const barraRelleno = seleccionar('#carga-barra-relleno');
    const momentoInicial = performance.now(); 

    document.body.classList.add('sin-scroll');

    
    (function actualizarCarga(momentoActual) {
        
        const progreso = Math.min(1, (momentoActual - momentoInicial) / DURACION_CARGA_MS);

        textoPorcentaje.textContent = Math.round(progreso * 100) + '%';        
        barraRelleno.style.width = progreso * 100 + '%';                       
        anilloCarga.style.setProperty('--porcentaje-carga', progreso * 100);   

        if (progreso < 1) {
            requestAnimationFrame(actualizarCarga); 
        } else {
            pantallaCarga.classList.add('terminado');           
            document.body.classList.remove('sin-scroll');       
            setTimeout(() => pantallaCarga.remove(), 600);     
        }
    })(momentoInicial);
}
