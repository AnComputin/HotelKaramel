/* ============================================
   habitaciones.js — A cargo de MARK
   R.2: Galería de habitaciones (renderizado dinámico)
   R.9: Contador de habitaciones disponibles
   R.13: Filtro de habitaciones por tipo/precio
   ============================================ */

// Datos iniciales de las habitaciones con tus rutas de imágenes locales
const datosIniciales = [
  { 
    nombre: "Habitación Individual", 
    tipo: "individual", 
    precio: 40000, 
    disponibles: 3, 
    imagen: "img/habitacion_simple.png", 
    descripcion: "Ideal para viajeros solos. Incluye Wi-Fi y desayuno continental." 
  },
  { 
    nombre: "Habitación Doble", 
    tipo: "doble", 
    precio: 65000, 
    disponibles: 5, 
    imagen: "img/habitacion_doble.jpg", 
    descripcion: "Cómoda habitación para 2 personas con cama matrimonial o 2 camas twin." 
  },
  { 
    nombre: "Suite Karamel", 
    tipo: "suite", 
    precio: 120000, 
    disponibles: 2, 
    imagen: "img/suite_karamel.jpg", 
    descripcion: "Máximo confort y espacio con vista panorámica y jacuzzi privado." 
  }
];

// Obtener habitaciones desde localStorage o guardar el estado inicial
function obtenerHabitaciones() {
  const guardadas = localStorage.getItem("habitaciones_karamel");
  if (guardadas) {
    return JSON.parse(guardadas);
  } else {
    localStorage.setItem("habitaciones_karamel", JSON.stringify(datosIniciales));
    return datosIniciales;
  }
}

let habitaciones = obtenerHabitaciones();

const contenedorHabitaciones = document.getElementById("lista-habitaciones");
const contadorDisponibles = document.getElementById("contador-disponibles");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroPrecio = document.getElementById("filtro-precio");

// R.2 — Dibuja las cards de habitaciones en pantalla
function renderizarHabitaciones(lista) {
  if (!contenedorHabitaciones) return;
  contenedorHabitaciones.innerHTML = "";

  lista.forEach((hab) => {
    const columna = document.createElement("div");
    columna.className = "col-md-4 habitacion-card";
    columna.dataset.tipo = hab.tipo;
    columna.dataset.precio = hab.precio;

    // Verificar si quedan unidades disponibles
    const hayCupo = hab.disponibles > 0;
    const botonHTML = hayCupo 
      ? `<a href="reservas.html?habitacion=${hab.tipo}" class="btn btn-karamel mt-3 w-100">Reservar</a>`
      : `<button class="btn btn-secondary mt-3 w-100" disabled>Agotada</button>`;

    columna.innerHTML = `
      <div class="card card-karamel h-100 shadow-sm">
        <img src="${hab.imagen}" class="card-img-top" alt="${hab.nombre}">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title fw-bold">${hab.nombre}</h5>
            <p class="card-text text-muted">${hab.descripcion}</p>
            <p class="precio fw-bold text-primary fs-5 mb-1">$${hab.precio.toLocaleString("es-CL")} / noche</p>
            <small class="text-secondary d-block">Disponibles: <strong>${hab.disponibles}</strong></small>
          </div>
          ${botonHTML}
        </div>
      </div>
    `;

    contenedorHabitaciones.appendChild(columna);
  });
}

// R.9 — Actualiza el contador según la lista visible actualmente
function actualizarContador(lista) {
  if (!contadorDisponibles) return;
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

// Escuchadores de eventos para los filtros
if (filtroTipo) filtroTipo.addEventListener("change", aplicarFiltros);
if (filtroPrecio) filtroPrecio.addEventListener("change", aplicarFiltros);

// Estado inicial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  habitaciones = obtenerHabitaciones();
  renderizarHabitaciones(habitaciones);
  actualizarContador(habitaciones);
});