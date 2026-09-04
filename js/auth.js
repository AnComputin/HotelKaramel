/* ============================================
auth.js
Sistema central de autenticación
Hotel Karamel 
============================================ */


/* ============================================
CONFIGURACIÓN
   ============================================ */

const CLAVE_USUARIOS = "usuarios_karamel";
const CLAVE_USUARIO_ACTUAL = "usuario_actual_karamel";


/* ============================================
OBTENER TODOS LOS USUARIOS
   ============================================ */

function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem(CLAVE_USUARIOS);

    if (!usuariosGuardados) {
        return [];
    }

    return JSON.parse(usuariosGuardados);
}


/* ============================================
GUARDAR USUARIOS
   ============================================ */

function guardarUsuarios(usuarios) {
    localStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}


/* ============================================
BUSCAR USUARIO POR CORREO
   ============================================ */

function buscarUsuarioPorEmail(email) {
    const usuarios = obtenerUsuarios();

    return usuarios.find(
        (usuario) =>
            usuario.email.toLowerCase() === email.toLowerCase()
    );
}


/* ============================================
REGISTRAR NUEVO USUARIO
   ============================================ */

function registrarUsuario(nombre, email, password) {

    // Obtener usuarios existentes
    const usuarios = obtenerUsuarios();

    // Revisar si el correo ya está registrado
    const usuarioExistente = buscarUsuarioPorEmail(email);

    if (usuarioExistente) {
        return {
            exito: false,
            mensaje: "Ya existe una cuenta registrada con este correo."
        };
    }


    // Crear nuevo usuario
    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password: password
    };


    // Agregar usuario
    usuarios.push(nuevoUsuario);


    // Guardar usuarios
    guardarUsuarios(usuarios);


    return {
        exito: true,
        mensaje: "Usuario registrado correctamente.",
        usuario: nuevoUsuario
    };
}


/* ============================================
   INICIAR SESIÓN
   ============================================ */

function iniciarSesion(email, password) {

    const usuario = buscarUsuarioPorEmail(email);

    // Revisar si existe el usuario
    if (!usuario) {
        return {
            exito: false,
            mensaje: "No existe una cuenta registrada con este correo."
        };
    }


    // Revisar contraseña
    if (usuario.password !== password) {
        return {
            exito: false,
            mensaje: "La contraseña es incorrecta."
        };
    }


    // Guardar sesión actual
    localStorage.setItem(
        CLAVE_USUARIO_ACTUAL,
        JSON.stringify(usuario)
    );


    return {
        exito: true,
        mensaje: "Inicio de sesión exitoso.",
        usuario: usuario
    };
}


/* ============================================
OBTENER USUARIO ACTUAL
   ============================================ */

function obtenerUsuarioActual() {

    const usuarioActual = localStorage.getItem(
        CLAVE_USUARIO_ACTUAL
    );

    if (!usuarioActual) {
        return null;
    }

    return JSON.parse(usuarioActual);
}


/* ============================================
VERIFICAR SI HAY UNA SESIÓN ACTIVA
   ============================================ */

function usuarioHaIniciadoSesion() {

    const usuario = obtenerUsuarioActual();

    return usuario !== null;
}


/* ============================================
CERRAR SESIÓN
   ============================================ */

function cerrarSesion() {

    localStorage.removeItem(
        CLAVE_USUARIO_ACTUAL
    );

    window.location.href = "index.html";
}


/* ============================================
   MENÚ DINÁMICO DE USUARIO
   ============================================ */

function actualizarMenuUsuario() {

    // Buscar todos los menús de navegación
    const menus = document.querySelectorAll(
        ".navbar-nav"
    );


    // Obtener usuario conectado
    const usuario = obtenerUsuarioActual();


    menus.forEach(function (menu) {

        // Buscar menú anterior de autenticación
        const menuAuthAnterior = menu.querySelector(
            ".menu-auth"
        );


        // Si existe, eliminarlo para evitar duplicados
        if (menuAuthAnterior) {

            menuAuthAnterior.remove();

        }


        /* ============================================
           USUARIO SIN SESIÓN
           ============================================ */

        if (!usuario) {

            menu.insertAdjacentHTML(
                "beforeend",

                `
                <li class="nav-item menu-auth">
                    <a
                        class="nav-link"
                        href="registro.html"
                    >
                        Registrarse
                    </a>
                </li>

                <li class="nav-item menu-auth">
                    <a
                        class="nav-link"
                        href="login.html"
                    >
                        Iniciar sesión
                    </a>
                </li>
                `
            );

            return;

        }


        /* ============================================
           USUARIO CON SESIÓN
           ============================================ */

        menu.insertAdjacentHTML(
            "beforeend",

            `
            <li class="nav-item menu-auth">
                <a
                    class="nav-link"
                    href="perfil.html"
                >
                    <i class="bi bi-person-circle"></i>
                    Mi perfil
                </a>
            </li>

            <li class="nav-item menu-auth">
                <a
                    class="nav-link"
                    href="#"
                    id="btnCerrarSesion"
                >
                    Cerrar sesión
                </a>
            </li>
            `
        );

    });


    /* ============================================
       EVENTO CERRAR SESIÓN
       ============================================ */

    const botonesCerrarSesion = document.querySelectorAll(
        "#btnCerrarSesion"
    );


    botonesCerrarSesion.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    cerrarSesion();

                }
            );

        }
    );

}


/* ============================================
   EJECUTAR AL CARGAR LA PÁGINA
   ============================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarMenuUsuario();

    }
);


/* ============================================
   MENÚ DINÁMICO DE USUARIO
   ============================================ */


function actualizarMenuUsuario() {

    // Buscar todos los menús de navegación
    const menus = document.querySelectorAll(
        ".navbar-nav"
    );


    // Obtener usuario conectado
    const usuario = obtenerUsuarioActual();


    menus.forEach(function (menu) {

        // Eliminar todos los elementos anteriores
        // relacionados con autenticación
        const menusAuthAnteriores = menu.querySelectorAll(
            ".menu-auth"
        );

        menusAuthAnteriores.forEach(function (elemento) {
            elemento.remove();
        });


        /* ============================================
           USUARIO SIN SESIÓN
           ============================================ */

        if (!usuario) {

            menu.insertAdjacentHTML(
                "beforeend",

                `
                <li class="nav-item menu-auth">
                    <a
                        class="nav-link"
                        href="registro.html"
                    >
                        Registrarse
                    </a>
                </li>

                <li class="nav-item menu-auth">
                    <a
                        class="nav-link"
                        href="login.html"
                    >
                        Iniciar sesión
                    </a>
                </li>
                `
            );

            return;
        }


        /* ============================================
           USUARIO CON SESIÓN
           ============================================ */

        menu.insertAdjacentHTML(
            "beforeend",

            `
            <li class="nav-item menu-auth">
                <a
                    class="nav-link"
                    href="perfil.html"
                >
                    <i class="bi bi-person-circle"></i>
                    Mi perfil
                </a>
            </li>

            <li class="nav-item menu-auth">
                <a
                    class="nav-link btn-cerrar-sesion"
                    href="#"
                >
                    Cerrar sesión
                </a>
            </li>
            `
        );

    });


    /* ============================================
       EVENTO CERRAR SESIÓN
       ============================================ */

    const botonesCerrarSesion = document.querySelectorAll(
        ".btn-cerrar-sesion"
    );


    botonesCerrarSesion.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    cerrarSesion();

                }
            );

        }
    );

}




/* ============================================
   EJECUTAR AL CARGAR LA PÁGINA
   ============================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarMenuUsuario();

    }
);


