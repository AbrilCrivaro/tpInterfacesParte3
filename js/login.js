

const vistaInicioSesion = seleccionar('#vista-inicio-sesion');
const vistaRegistro = seleccionar('#vista-registro');

function mostrarVistaSegunHash() {
    const esRegistro = location.hash === '#registro';
    vistaInicioSesion.hidden = esRegistro;  // "hidden" esconde el elemento
    vistaRegistro.hidden = !esRegistro;
    document.title = (esRegistro ? 'Creá tu cuenta' : 'Iniciar sesión') + ' · Spider Games';
}
addEventListener('hashchange', mostrarVistaSegunHash); 
mostrarVistaSegunHash();                              


const ojoAbierto = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.722 7.59687C14.1727 6.43968 13.519 5.49593 12.761 4.76562L11.966 5.56062C12.6143 6.18015 13.179 6.99062 13.6673 7.99999C12.3673 10.6906 10.522 11.9687 8.00009 11.9687C7.24311 11.9687 6.54587 11.8522 5.90837 11.6191L5.04697 12.4805C5.93238 12.8893 6.91676 13.0937 8.00009 13.0937C11.0032 13.0937 13.2438 11.5297 14.722 8.40156C14.7814 8.27575 14.8122 8.13834 14.8122 7.99921C14.8122 7.86008 14.7814 7.72267 14.722 7.59687ZM13.7287 2.58687L13.0626 1.91999C13.051 1.90837 13.0372 1.89915 13.022 1.89286C13.0068 1.88657 12.9906 1.88333 12.9742 1.88333C12.9577 1.88333 12.9415 1.88657 12.9263 1.89286C12.9111 1.89915 12.8973 1.90837 12.8857 1.91999L11.1768 3.62812C10.2346 3.14687 9.17571 2.90624 8.00009 2.90624C4.99697 2.90624 2.75634 4.4703 1.27822 7.59843C1.2188 7.72424 1.18799 7.86164 1.18799 8.00077C1.18799 8.1399 1.2188 8.27731 1.27822 8.40312C1.86874 9.64687 2.57967 10.6438 3.41103 11.3939L1.75759 13.0469C1.73417 13.0703 1.72101 13.1021 1.72101 13.1352C1.72101 13.1684 1.73417 13.2001 1.75759 13.2236L2.42462 13.8906C2.44806 13.914 2.47984 13.9272 2.51298 13.9272C2.54612 13.9272 2.5779 13.914 2.60134 13.8906L13.7287 2.76374C13.7403 2.75213 13.7495 2.73835 13.7558 2.72317C13.7621 2.708 13.7653 2.69173 13.7653 2.6753C13.7653 2.65888 13.7621 2.64261 13.7558 2.62744C13.7495 2.61226 13.7403 2.59848 13.7287 2.58687ZM2.3329 7.99999C3.63447 5.30937 5.47978 4.03124 8.00009 4.03124C8.85228 4.03124 9.62712 4.17749 10.3301 4.47484L9.23165 5.57327C8.71145 5.29572 8.1158 5.19271 7.5326 5.27944C6.94939 5.36617 6.4095 5.63805 5.99258 6.05498C5.57565 6.4719 5.30377 7.01179 5.21704 7.595C5.1303 8.17821 5.23331 8.77385 5.51087 9.29405L4.20743 10.5975C3.48603 9.96077 2.86415 9.09812 2.3329 7.99999ZM6.18759 7.99999C6.18786 7.72447 6.25313 7.45289 6.37808 7.20733C6.50303 6.96177 6.68414 6.74914 6.9067 6.58673C7.12926 6.42431 7.387 6.31668 7.65898 6.27259C7.93095 6.2285 8.20949 6.24918 8.47197 6.33296L6.27056 8.53437C6.21538 8.36162 6.18739 8.18134 6.18759 7.99999Z" fill="#B7B9CF"/>
    <path d="M7.93762 9.75C7.88355 9.75 7.83027 9.7475 7.77746 9.74265L6.95215 10.568C7.44854 10.7581 7.98937 10.8003 8.50926 10.6896C9.02915 10.5789 9.50583 10.3199 9.8817 9.94407C10.2576 9.56821 10.5165 9.09152 10.6272 8.57164C10.7379 8.05175 10.6957 7.51092 10.5056 7.01453L9.68027 7.83984C9.68512 7.89265 9.68762 7.94593 9.68762 8C9.68774 8.22984 9.64256 8.45746 9.55466 8.66984C9.46676 8.88221 9.33786 9.07518 9.17533 9.23771C9.0128 9.40023 8.81983 9.52913 8.60746 9.61704C8.39508 9.70494 8.16747 9.75012 7.93762 9.75Z" fill="#B7B9CF"/>
    </svg>`;

const ojoCerrado = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.2571 13.038C21.7311 12.419 21.7311 11.582 21.2571 10.962C19.7641 9.013 16.1821 5 12.0001 5C7.81806 5 4.23606 9.013 2.74306 10.962C2.51211 11.2587 2.38672 11.624 2.38672 12C2.38672 12.376 2.51211 12.7413 2.74306 13.038C4.23606 14.987 7.81806 19 12.0001 19C16.1821 19 19.7641 14.987 21.2571 13.038Z" stroke="#B7B9CF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#B7B9CF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;


seleccionarTodos('.boton-ver-contrasena').forEach(botonOjo => {
    botonOjo.onclick = () => {
        const campoContrasena = botonOjo.previousElementSibling; 
        const estaOculta = campoContrasena.type === 'password';
        
        campoContrasena.type = estaOculta ? 'text' : 'password'; 

        
        botonOjo.innerHTML = estaOculta ? ojoCerrado : ojoAbierto;
    };
});


seleccionarTodos('.botones-sociales .boton').forEach(botonSocial => {
    botonSocial.onclick = () => {
        mostrarAviso('Próximamente', 'El acceso con ' + botonSocial.dataset.redSocial + ' se activa con el backend.');
    };
});


const captcha = seleccionar('.captcha');

captcha.onclick = () => {
    if (captcha.dataset.verificado) return; 

    captcha.classList.add('cargando'); 
    setTimeout(() => {                 
        captcha.classList.remove('cargando');
        captcha.dataset.verificado = 1;
        seleccionar('.captcha-casilla', captcha).textContent = '✓';
    }, 900);
};


const validarEmail = campoEmail => validarCampo(
    campoEmail,
    REGEX_EMAIL.test(campoEmail.value) ? '' : 'Ingresá un email válido: nombre@dominio.com'
);

// cuando hay error
function hacerTemblarTarjeta(tarjeta) {
    tarjeta.classList.remove('temblor');
    void tarjeta.offsetWidth; 
    tarjeta.classList.add('temblor');
}


seleccionar('#formulario-inicio-sesion').onsubmit = evento => {
    evento.preventDefault();                     
    const campos = evento.target.elements;       

    const todoCorrecto = [
        validarEmail(campos.email),
        validarCampo(campos.contrasena, campos.contrasena.value ? '' : 'Ingresá tu contraseña.')
    ].every(Boolean);

    if (!todoCorrecto) return hacerTemblarTarjeta(evento.target.closest('.tarjeta-formulario'));

    
    seleccionar('button[type=submit]', evento.target).textContent = 'Ingresando…';
    setTimeout(() => location.href = 'index.html', 700);
};



seleccionar('#formulario-registro').onsubmit = evento => {
    evento.preventDefault();
    const campos = evento.target.elements;
    const edad = Number(campos.edad.value);

    let todoCorrecto = [
        validarCampo(campos.nombre, campos.nombre.value.trim().length < 3 ? 'Ingresá tu nombre y apellido.' : ''),
        validarCampo(campos.edad, edad >= 13 && edad <= 110 ? '' : 'Mín. 13'),
        validarEmail(campos.email),
        validarCampo(campos.contrasena, campos.contrasena.value.length < 8 ? 'Usá al menos 8 caracteres.' : ''),
        validarCampo(
            campos.repetirContrasena,
            campos.repetirContrasena.value && campos.repetirContrasena.value === campos.contrasena.value
                ? '' : 'Las contraseñas no coinciden.'
        )
    ].every(Boolean);

   
    const captchaVerificado = Boolean(captcha.dataset.verificado);
    seleccionar('#captcha-mensaje').textContent = captchaVerificado ? '' : 'Confirmá que no sos un robot.';
    if (!captchaVerificado) todoCorrecto = false;

    if (!todoCorrecto) return hacerTemblarTarjeta(evento.target.closest('.tarjeta-formulario'));

    const nombreParaSaludar = (campos.nickname.value || campos.nombre.value).trim().split(' ')[0];
    mostrarBienvenida(nombreParaSaludar);
};


function mostrarBienvenida(nombre) {
    localStorage.setItem('sg_usuario', nombre); 
    seleccionar('#nombre-bienvenida').textContent = nombre;
    seleccionar('#pantalla-registro-exitoso').hidden = false; 
    setTimeout(() => location.href = 'index.html', 3400);
}

//boton inicio // 
const botonIniciarSesion = seleccionar('#formulario-inicio-sesion button[type=submit]');


const envoltorioDestellos = document.createElement('div');
envoltorioDestellos.className = 'boton-destellos';
botonIniciarSesion.before(envoltorioDestellos);
envoltorioDestellos.append(botonIniciarSesion);

botonIniciarSesion.addEventListener('click', () => {
    envoltorioDestellos.classList.remove('activo');
    void envoltorioDestellos.offsetWidth;
    envoltorioDestellos.classList.add('activo');
    setTimeout(() => envoltorioDestellos.classList.remove('activo'), 600);

    // Una telaraña por destello, abajo o arriba del boton
    for (let i = 0; i < 8; i++) {
        const destello = document.createElement('i');
        destello.className = 'destello';
        const salePorArriba = Math.random() < 0.5;
        destello.style.setProperty('--x', Math.random() * 100 + '%');
        destello.style.setProperty('--y', (salePorArriba ? -10 + Math.random() * 20 : 90 + Math.random() * 20) + '%');
        destello.style.setProperty('--tam', 14 + Math.random() * 16 + 'px');
        destello.style.setProperty('--retraso', Math.random() * 0.2 + 's');
        destello.addEventListener('animationend', () => destello.remove());
        envoltorioDestellos.append(destello);
    }
});
