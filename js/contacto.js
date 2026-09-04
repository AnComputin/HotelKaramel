/* ============================================
   contacto.js — A cargo de MARK
   R.8: Validación del formulario de contacto
   ============================================ */

const formContacto = document.getElementById("form-contacto");
const inputNombreContacto = document.getElementById("nombre-contacto");
const inputCorreoContacto = document.getElementById("correo-contacto");
const inputMensajeContacto = document.getElementById("mensaje-contacto");
const mensajeErrorContacto = document.getElementById("mensaje-error-contacto");
const mensajeExitoContacto = document.getElementById("mensaje-exito-contacto");

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarContacto() {
  mensajeErrorContacto.classList.add("d-none-karamel");
  mensajeExitoContacto.classList.add("d-none-karamel");

  if (!inputNombreContacto.value.trim() || !inputMensajeContacto.value.trim()) {
    mostrarErrorContacto("Por favor completa tu nombre y tu mensaje.");
    return false;
  }

  if (!regexCorreo.test(inputCorreoContacto.value.trim())) {
    mostrarErrorContacto("Ingresa un correo electrónico válido.");
    return false;
  }

  return true;
}

function mostrarErrorContacto(texto) {
  mensajeErrorContacto.textContent = texto;
  mensajeErrorContacto.classList.remove("d-none-karamel");
}

formContacto.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (validarContacto()) {
    mensajeExitoContacto.classList.remove("d-none-karamel");
    formContacto.reset();
    // TODO (Mark): aquí se podría enviar el mensaje a un backend si el proyecto lo requiere
  }
});
