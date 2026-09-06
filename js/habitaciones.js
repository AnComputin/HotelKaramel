/* ============================================
   habitaciones.js — A cargo de MARK
   R.2: Galería de habitaciones (renderizado dinámico)
   R.9: Contador de habitaciones disponibles
   R.13: Filtro de habitaciones por tipo/precio
   ============================================ */

// El array `habitaciones` ahora vive en js/habitaciones-data.js (fuente única
// de verdad, compartida con reservas.js) para que precio/disponibilidad nunca
// queden desincronizados entre páginas. Ese script debe cargarse antes que este.

const contenedorHabitaciones = document.getElementById("lista-habitaciones");
const contadorDisponibles = document.getElementById("contador-disponibles");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroPrecio = document.getElementById("filtro-precio");

// R.2 — Dibuja las cards de habitaciones en pantalla
function renderizarHabitaciones(lista) {
  contenedorHabitaciones.innerHTML = "";

  lista.forEach((hab) => {
    const columna = document.createElement("div");
    columna.className = "col-md-4 habitacion-card";
    columna.dataset.tipo = hab.tipo;
    columna.dataset.precio = hab.precio;

    columna.innerHTML = `
      <div class="card card-karamel h-100 clickable-card" role="button" tabindex="0" aria-label="Reservar ${hab.nombre}">
        <img src="${hab.imagen}" class="card-img-top" alt="${hab.nombre}">
        <div class="card-body">
          <h5 class="card-title">${hab.nombre}</h5>
          <p class="card-text">${hab.descripcion}</p>
          <p class="precio">$${hab.precio.toLocaleString("es-CL")} / noche</p>
        </div>
      </div>
    `;

    const irAReservar = () => {
      window.location.href = `reservas.html?habitacion=${hab.tipo}`;
    };

    columna.addEventListener("click", irAReservar);
    columna.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        irAReservar();
      }
    });

    contenedorHabitaciones.appendChild(columna);
  });
}

// R.9 — Actualiza el contador según la lista visible actualmente
function actualizarContador(lista) {
  const totalDisponibles = lista.reduce((suma, hab) => suma + hab.disponibles, 0);
  contadorDisponibles.textContent = totalDisponibles;
}

// R.13 — Filtra el array según tipo y precio máximo seleccionados
function aplicarFiltros() {
  const tipoSeleccionado = filtroTipo.value;
  const precioMaximo = Number(filtroPrecio.value);

  let resultado = habitaciones;

  if (tipoSeleccionado !== "todas") {
    resultado = resultado.filter((hab) => hab.tipo === tipoSeleccionado);
  }

  if (precioMaximo > 0) {
    resultado = resultado.filter((hab) => hab.precio <= precioMaximo);
  }

  renderizarHabitaciones(resultado);
  actualizarContador(resultado);
}

filtroTipo.addEventListener("change", aplicarFiltros);
filtroPrecio.addEventListener("change", aplicarFiltros);

// Estado inicial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderizarHabitaciones(habitaciones);
  actualizarContador(habitaciones);
});
