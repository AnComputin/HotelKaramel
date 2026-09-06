/* ============================================
   registro.js — Registro de nuevos usuarios
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("formRegistro");
  const inputNombre = document.getElementById("nombre");
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");
  const inputConfirmPassword = document.getElementById("confirmPassword");
  const mensajeRegistro = document.getElementById("mensajeRegistro");

  formRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value;
    const confirmPassword = inputConfirmPassword.value;

    if (nombre.length < 3) {
      mostrarMensaje(mensajeRegistro, "Ingresa un nombre válido.", "error");
      return;
    }

    if (password.length < 6) {
      mostrarMensaje(mensajeRegistro, "La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmPassword) {
      mostrarMensaje(mensajeRegistro, "Las contraseñas no coinciden.", "error");
      return;
    }

    const resultado = registrarUsuario(nombre, email, password);

    if (!resultado.exito) {
      mostrarMensaje(mensajeRegistro, resultado.mensaje, "error");
      return;
    }

    mostrarMensaje(mensajeRegistro, "¡Cuenta creada correctamente! Redirigiendo...", "success");
    formRegistro.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
});