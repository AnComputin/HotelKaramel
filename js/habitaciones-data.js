/* ============================================
   habitaciones-data.js — Fuente única de verdad
   Datos de habitaciones compartidos entre
   habitaciones.js (galería) y reservas.js (formulario).
   Cargar este script ANTES de habitaciones.js / reservas.js.
   ============================================ */

const habitaciones = [
  { nombre: "Habitación Individual", tipo: "individual", precio: 45000,  disponibles: 4, imagen: "img/recepcion.jpeg", descripcion: "Ideal para viajeros solos." },
  { nombre: "Habitación Doble",      tipo: "doble",      precio: 75000,  disponibles: 6, imagen: "img/louge.jpeg",     descripcion: "Cómoda para dos personas." },
  { nombre: "Suite",                 tipo: "suite",      precio: 150000, disponibles: 2, imagen: "img/HotelKaramel.png", descripcion: "Máximo confort y espacio." },
];
// NOTA: las imágenes de arriba son temporales (reutilizan fotos generales del hotel).
// Reemplazar por fotos reales de cada habitación cuando estén disponibles.
