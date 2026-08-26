/* ============================================
   perfil.js — Renderizado del Panel del Usuario
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = obtenerUsuarioActivo();

  // Proteger la página: Redirigir si no ha iniciado sesión
  if (!usuarioActivo) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nombre-usuario-perfil").textContent = usuarioActivo.nombre;
  document.getElementById("email-usuario-perfil").textContent = usuarioActivo.email;

  renderizarReservasUsuario(usuarioActivo.email);
});

function renderizarReservasUsuario(email) {
  const todasLasReservas = JSON.parse(localStorage.getItem("historial_reservas_karamel")) || [];
  const misReservas = todasLasReservas.filter((r) => r.emailUsuario === email);

  const contenedorActivas = document.getElementById("reservas-activas");
  const contenedorHistorial = document.getElementById("reservas-historial");

  if (!contenedorActivas || !contenedorHistorial) return;

  contenedorActivas.innerHTML = "";
  contenedorHistorial.innerHTML = "";

  const hoy = new Date().toISOString().split("T")[0];

  misReservas.forEach((reserva) => {
    const esActiva = reserva.fechaSalida >= hoy;

    const cardHTML = `
      <div class="card mb-3 shadow-sm card-karamel">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${reserva.tipoHabitacion}</h5>
          <p class="card-text mb-1"><strong>Entrada:</strong> ${reserva.fechaEntrada} — <strong>Salida:</strong> ${reserva.fechaSalida}</p>
          <p class="card-text mb-1"><strong>Huéspedes:</strong> ${reserva.huespedes} persona(s)</p>
          <p class="card-text fw-bold text-primary">Total: ${reserva.precioTotal}</p>
        </div>
      </div>
    `;

    if (esActiva) {
      contenedorActivas.innerHTML += cardHTML;
    } else {
      contenedorHistorial.innerHTML += cardHTML;
    }
  });

  if (contenedorActivas.innerHTML === "") {
    contenedorActivas.innerHTML = "<p class='text-muted'>No tienes reservas activas en este momento.</p>";
  }
}