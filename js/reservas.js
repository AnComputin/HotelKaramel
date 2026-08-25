/* ============================================
   reservas.js — A cargo de ANAÏS
   R.4: Validación del formulario de reserva
   R.5: Cálculo dinámico del precio total
   R.12: Confirmación de reserva
   ============================================ */

const formReserva = document.getElementById("form-reserva");
const inputNombre = document.getElementById("nombre-reserva");
const inputEntrada = document.getElementById("fecha-entrada");
const inputSalida = document.getElementById("fecha-salida");
const selectTipoHabitacion = document.getElementById("tipo-habitacion");
const inputHuespedes = document.getElementById("huespedes");
const spanPrecioTotal = document.getElementById("precio-total");
const mensajeError = document.getElementById("mensaje-error-reserva");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

// R.5 — Calcula noches x precio de la habitación seleccionada
function calcularPrecioTotal() {
  const fechaEntrada = new Date(inputEntrada.value);
  const fechaSalida = new Date(inputSalida.value);
  const opcionSeleccionada = selectTipoHabitacion.selectedOptions[0];
  const precioPorNoche = opcionSeleccionada ? Number(opcionSeleccionada.dataset.precio || 0) : 0;

  const unDiaEnMs = 1000 * 60 * 60 * 24;
  const noches = Math.round((fechaSalida - fechaEntrada) / unDiaEnMs);

  if (!isNaN(noches) && noches > 0 && precioPorNoche > 0) {
    const total = noches * precioPorNoche;
    spanPrecioTotal.textContent = `$${total.toLocaleString("es-CL")}`;
  } else {
    spanPrecioTotal.textContent = "$0";
  }
}

[inputEntrada, inputSalida, selectTipoHabitacion].forEach((campo) => {
  campo.addEventListener("change", calcularPrecioTotal);
});

// R.4 — Valida los campos obligatorios y coherencia de fechas
function validarReserva() {
  mensajeError.classList.add("d-none-karamel");

  if (!inputNombre.value.trim() || !inputEntrada.value || !inputSalida.value ||
      !selectTipoHabitacion.value || !inputHuespedes.value) {
    mostrarError("Por favor completa todos los campos obligatorios.");
    return false;
  }

  const fechaEntrada = new Date(inputEntrada.value);
  const fechaSalida = new Date(inputSalida.value);

  if (fechaSalida <= fechaEntrada) {
    mostrarError("La fecha de salida debe ser posterior a la fecha de entrada.");
    return false;
  }

  return true;
}

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.classList.remove("d-none-karamel");
  mensajeConfirmacion.classList.add("d-none-karamel");
}

// R.12 — Confirmación de reserva al enviar correctamente
formReserva.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (validarReserva()) {
    mensajeError.classList.add("d-none-karamel");
    mensajeConfirmacion.classList.remove("d-none-karamel");
    // TODO (Anaïs): aquí se podría limpiar el formulario o guardar los datos
  }
});
