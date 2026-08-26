/* ============================================
   auth.js — Sistema de Autenticación y Sesión
   ============================================ */

// Registrar usuario e iniciar sesión automáticamente
function registrarUsuario(nombre, email, password) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios_karamel")) || [];

  // Verificar si el correo ya existe
  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    return { exito: false, mensaje: "El correo ya se encuentra registrado." };
  }

  const nuevoUsuario = { nombre, email, password };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios_karamel", JSON.stringify(usuarios));

  // Iniciar sesión inmediatamente
  localStorage.setItem("usuario_activo", JSON.stringify(nuevoUsuario));
  return { exito: true };
}

// Iniciar Sesión
function iniciarSesion(email, password) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios_karamel")) || [];
  const usuario = usuarios.find((u) => u.email === email && u.password === password);

  if (!usuario) {
    return { exito: false, mensaje: "Correo o contraseña incorrectos." };
  }

  localStorage.setItem("usuario_activo", JSON.stringify(usuario));
  return { exito: true };
}

// Obtener el usuario con sesión activa
function obtenerUsuarioActivo() {
  const usuario = localStorage.getItem("usuario_activo");
  return usuario ? JSON.parse(usuario) : null;
}

// Cerrar Sesión
function cerrarSesion() {
  localStorage.removeItem("usuario_activo");
  window.location.href = "login.html";
}

// Actualizar el botón de la barra de navegación dinámicamente
function actualizarNavbar() {
  const contenedorMenu = document.getElementById("menu-usuario");
  if (!contenedorMenu) return;

  const usuarioActivo = obtenerUsuarioActivo();

  if (usuarioActivo) {
    // Si hay sesión iniciada: Botón directo a "Mi Perfil" + Menú desplegable
    contenedorMenu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-karamel dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          👤 ${usuarioActivo.nombre}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item fw-bold" href="perfil.html">Ver Mi Perfil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><button class="dropdown-item text-danger" onclick="cerrarSesion()">Cerrar Sesión</button></li>
        </ul>
      </div>
    `;
  } else {
    // Si NO hay sesión: Botón Iniciar Sesión
    contenedorMenu.innerHTML = `
      <a class="btn btn-outline-light btn-sm" href="login.html">Iniciar Sesión</a>
    `;
  }
}

// Ejecutar automáticamente al cargar cualquier página
document.addEventListener("DOMContentLoaded", actualizarNavbar);