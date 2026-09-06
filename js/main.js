/* ============================================
   main.js — Lógica compartida en TODAS las páginas
   R.11: Resaltar la sección activa del menú
   (el despliegue tipo hamburguesa en móvil ya lo
   maneja Bootstrap con data-bs-toggle="collapse")
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll(".navbar-karamel .nav-link");

  enlaces.forEach((enlace) => {
    const href = enlace.getAttribute("href");
    enlace.classList.remove("active");
    if (href === paginaActual) {
      enlace.classList.add("active");
    }
  });
});

// Utilidad compartida para mensajes de éxito/error en formularios de auth.
// login.js y registro.js la reutilizan para no duplicar la misma función.
function mostrarMensaje(elemento, mensaje, tipo, claseBase = "auth-message") {
  elemento.textContent = mensaje;
  elemento.className = claseBase;
  elemento.classList.add(`${claseBase}-${tipo}`);
}