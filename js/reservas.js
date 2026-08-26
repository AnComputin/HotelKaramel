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
  if (!inputEntrada || !inputSalida || !selectTipoHabitacion) return;

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

if (inputEntrada && inputSalida && selectTipoHabitacion) {
  [inputEntrada, inputSalida, selectTipoHabitacion].forEach((campo) => {
    campo.addEventListener("change", calcularPrecioTotal);
  });
}

// Función para descontar la habitación disponible del localStorage
function descontarHabitacion(tipoReservado) {
  const guardadas = localStorage.getItem("habitaciones_karamel");
  
  if (guardadas) {
    const habitaciones = JSON.parse(guardadas);
    const indice = habitaciones.findIndex((h) => h.tipo === tipoReservado);

    if (indice !== -1 && habitaciones[indice].disponibles > 0) {
      habitaciones[indice].disponibles -= 1; // Descuenta 1 unidad
      localStorage.setItem("habitaciones_karamel", JSON.stringify(habitaciones));
      return true;
    }
  }
  return false;
}

// R.4 — Valida los campos obligatorios, la coherencia de fechas y el stock
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

  // Verificar si hay disponibilidad disponible antes de procesar
  const guardadas = localStorage.getItem("habitaciones_karamel");
  if (guardadas) {
    const habitaciones = JSON.parse(guardadas);
    const habSeleccionada = habitaciones.find((h) => h.tipo === selectTipoHabitacion.value);
    
    if (habSeleccionada && habSeleccionada.disponibles <= 0) {
      mostrarError("Lo sentimos, ya no quedan habitaciones disponibles de este tipo.");
      return false;
    }
  }

  // Dentro del evento submit de reservas.js cuando la validación sea exitosa:
if (validarReserva()) {
  const usuarioActivo = obtenerUsuarioActivo();

  if (!usuarioActivo) {
    mostrarError("Debes iniciar sesión para realizar una reserva.");
    return;
  }

  const nuevaReserva = {
    id: Date.now(),
    emailUsuario: usuarioActivo.email,
    tipoHabitacion: selectTipoHabitacion.value,
    fechaEntrada: inputEntrada.value,
    fechaSalida: inputSalida.value,
    huespedes: inputHuespedes.value,
    precioTotal: spanPrecioTotal.textContent,
    fechaCreacion: new Date().toLocaleDateString("es-CL")
  };

  // Guardar en el historial general de reservas
  const historial = JSON.parse(localStorage.getItem("historial_reservas_karamel")) || [];
  historial.push(nuevaReserva);
  localStorage.setItem("historial_reservas_karamel", JSON.stringify(historial));

  // Descontar cupo en habitaciones
  descontarHabitacion(selectTipoHabitacion.value);

  mensajeConfirmacion.classList.remove("d-none-karamel");
  formReserva.reset();
}

  return true;

  

  
}

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.classList.remove("d-none-karamel");
  mensajeConfirmacion.classList.add("d-none-karamel");
}

// R.12 — Confirmación de reserva al enviar correctamente
if (formReserva) {
  formReserva.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (validarReserva()) {
      const tipoSeleccionado = selectTipoHabitacion.value;

      // Resta la habitación y guarda el nuevo total
      descontarHabitacion(tipoSeleccionado);

      mensajeError.classList.add("d-none-karamel");
      mensajeConfirmacion.classList.remove("d-none-karamel");
      
      // Limpiar formulario tras confirmar
      formReserva.reset();
      spanPrecioTotal.textContent = "$0";
    }
  });
}

// Capturar parámetro 'habitacion' desde la URL y preseleccionar
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const habitacionParam = params.get("habitacion");

  if (habitacionParam && selectTipoHabitacion) {
    selectTipoHabitacion.value = habitacionParam;
    calcularPrecioTotal(); // Recalcula si ya hay fechas ingresadas
  }
});