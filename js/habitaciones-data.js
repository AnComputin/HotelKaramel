/* ============================================
   habitaciones-data.js — Fuente única de verdad
   Datos de habitaciones compartidos entre
   habitaciones.js (galería) y reservas.js (formulario).
   Cargar este script ANTES de habitaciones.js / reservas.js.
   ============================================ */

const habitaciones = [
  { nombre: "Habitación Individual", tipo: "individual", precio: 45000,  disponibles: 4, imagen: "img/habitacion_simple.png", descripcion: "Ideal para viajeros solos." },
  { nombre: "Habitación Doble",      tipo: "doble",      precio: 75000,  disponibles: 6, imagen: "img/habitacion_doble.jpg",  descripcion: "Cómoda para dos personas." },
  { nombre: "Suite",                 tipo: "suite",      precio: 150000, disponibles: 2, imagen: "img/suite_karamel.jpg",     descripcion: "Máximo confort y espacio." },
];

// Fuente única de disponibilidad real: combina el array base con lo persistido
// en localStorage tras reservas/cancelaciones. Debe usarse en toda página que
// muestre disponibilidad (galería, reservas, etc.) para que nunca queden desincronizadas.
function obtenerHabitacionesConDisponibilidad() {
  const guardadas = JSON.parse(localStorage.getItem("disponibilidad_karamel") || "{}");
  return habitaciones.map((hab) => ({
    ...hab,
    disponibles: guardadas[hab.tipo] !== undefined ? guardadas[hab.tipo] : hab.disponibles,
  }));
}