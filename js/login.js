/* ============================================
   login.js — A cargo del sistema de autenticación
   Inicio de sesión
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");
  const mensajeLogin = document.getElementById("mensajeLogin");

  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputPassword.value;

    const resultado = iniciarSesion(email, password);

    if (!resultado.exito) {
      mostrarMensaje(mensajeLogin, resultado.mensaje, "error");
      return;
    }

    mostrarMensaje(mensajeLogin, `¡Bienvenido, ${resultado.usuario.nombre}!`, "success");
    formLogin.reset();

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
});