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
    if (href === paginaActual) {
      enlace.classList.add("active");
    }
  });
});
