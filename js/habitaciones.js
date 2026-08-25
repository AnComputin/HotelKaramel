/* ============================================
   habitaciones.js — A cargo de MARK
   R.2: Galería de habitaciones (renderizado dinámico)
   R.9: Contador de habitaciones disponibles
   R.13: Filtro de habitaciones por tipo/precio
   ============================================ */

// TODO (Mark): reemplazar/ampliar este array con las habitaciones reales del hotel
const habitaciones = [
  { nombre: "Habitación Individual", tipo: "individual", precio: 40000, disponibles: 3, imagen: "img/habitacion-individual.jpg", descripcion: "Ideal para viajeros solos." },
  { nombre: "Habitación Doble",      tipo: "doble",      precio: 65000, disponibles: 5, imagen: "img/habitacion-doble.jpg",      descripcion: "Cómoda para dos personas." },
  { nombre: "Suite",                 tipo: "suite",      precio: 120000, disponibles: 2, imagen: "img/habitacion-suite.jpg",     descripcion: "Máximo confort y espacio." },
];

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
      <div class="card card-karamel h-100">
        <img src="${hab.imagen}" class="card-img-top" alt="${hab.nombre}">
        <div class="card-body">
          <h5 class="card-title">${hab.nombre}</h5>
          <p class="card-text">${hab.descripcion}</p>
          <p class="precio">$${hab.precio.toLocaleString("es-CL")} / noche</p>
        </div>
      </div>
    `;

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
