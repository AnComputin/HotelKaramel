/* ============================================
auth.js
Sistema central de autenticación (Front-end demo)
NOTA: este sistema usa localStorage y contraseñas en claro — solo para demos/local.
============================================ */

/* Configuración */
const CLAVE_USUARIOS = "usuarios_karamel";
const CLAVE_USUARIO_ACTUAL = "usuario_actual_karamel";


/* Obtener todos los usuarios (desde localStorage) */
function obtenerUsuarios() {
    const raw = localStorage.getItem(CLAVE_USUARIOS);
    return raw ? JSON.parse(raw) : [];
}


/* Guardar usuarios */
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}


/* Buscar usuario por email (case-insensitive) */
function buscarUsuarioPorEmail(email) {
    if (!email) return null;
    const usuarios = obtenerUsuarios();
    return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}


/* Registrar nuevo usuario */
function registrarUsuario(nombre, email, password) {
    const usuarios = obtenerUsuarios();
    if (buscarUsuarioPorEmail(email)) {
        return { exito: false, mensaje: "Ya existe una cuenta registrada con este correo." };
    }

    const nuevo = {
        id: Date.now(),
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password: password, // WARNING: plain text for demo only
    };

    usuarios.push(nuevo);
    guardarUsuarios(usuarios);

    return { exito: true, mensaje: "Usuario registrado correctamente.", usuario: nuevo };
}


/* Iniciar sesión */
function iniciarSesion(email, password) {
    const usuario = buscarUsuarioPorEmail(email);
    if (!usuario) return { exito: false, mensaje: "No existe una cuenta registrada con este correo." };
    if (usuario.password !== password) return { exito: false, mensaje: "La contraseña es incorrecta." };

    localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuario));
    return { exito: true, mensaje: "Inicio de sesión exitoso.", usuario };
}


/* Obtener usuario actual */
function obtenerUsuarioActual() {
    const raw = localStorage.getItem(CLAVE_USUARIO_ACTUAL);
    return raw ? JSON.parse(raw) : null;
}


/* ¿Usuario inició sesión? */
function usuarioHaIniciadoSesion() {
    return obtenerUsuarioActual() !== null;
}


/* Cerrar sesión */
function cerrarSesion() {
    localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
    window.location.href = "index.html";
}


/* Actualizar menú de navegación según estado de sesión */
function actualizarMenuUsuario() {
    const menus = document.querySelectorAll(".navbar-nav");
    const usuario = obtenerUsuarioActual();

    menus.forEach((menu) => {
        // Eliminar entradas previas
        menu.querySelectorAll(".menu-auth").forEach((el) => el.remove());

        if (!usuario) {
            menu.insertAdjacentHTML(
                "beforeend",
                `
                    <li class="nav-item menu-auth"><a class="nav-link" href="registro.html">Registrarse</a></li>
                    <li class="nav-item menu-auth"><a class="nav-link" href="login.html">Iniciar sesión</a></li>
                `
            );
            return;
        }

        menu.insertAdjacentHTML(
            "beforeend",
            `
                <li class="nav-item menu-auth"><a class="nav-link" href="perfil.html"><i class="bi bi-person-circle"></i> Mi perfil</a></li>
                <li class="nav-item menu-auth"><a class="nav-link btn-cerrar-sesion" href="#">Cerrar sesión</a></li>
            `
        );
    });

    // Asociar evento cerrar sesión (delegación sencilla)
    document.querySelectorAll(".btn-cerrar-sesion").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    });
}


/* Ejecutar al cargar la página */
document.addEventListener("DOMContentLoaded", () => {
    actualizarMenuUsuario();
});


