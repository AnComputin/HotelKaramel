/* ============================================
   reservas.js — A cargo de ANAÏS
   R.3: Formulario de reserva
   R.4: Validación del formulario
   R.5: Cálculo dinámico del precio total
   R.12: Confirmación de reserva

   Usa el array `habitaciones` definido en js/habitaciones-data.js
   (debe cargarse antes que este script) como fuente única de verdad
   para nombres, precios, disponibilidad e imágenes.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del formulario
  const formReserva = document.getElementById("form-reserva");
  const inputNombre = document.getElementById("nombre");
  const inputEmail = document.getElementById("email");
  const inputFechaEntrada = document.getElementById("fecha-entrada");
  const inputFechaSalida = document.getElementById("fecha-salida");
  const selectHuespedes = document.getElementById("num-huespedes");
  const selectHabitacion = document.getElementById("select-habitacion");
  const checkServicios = document.querySelectorAll(".check-servicio");
  const inputCodigoPromo = document.getElementById("codigo-promo");
  const btnAplicarPromo = document.getElementById("btn-aplicar-promo");
  const msgPromo = document.getElementById("msg-promo");


  /* ============================================
     USUARIO ACTUAL
     ============================================ */

  const usuarioActual = obtenerUsuarioActual();


  // Si hay una sesión iniciada,
  // completar automáticamente nombre y correo
  if (usuarioActual) {

    inputNombre.value = usuarioActual.nombre;
    inputEmail.value = usuarioActual.email;

    // Evitar que se cambien los datos asociados
    // a la cuenta durante la reserva
    inputNombre.readOnly = true;
    inputEmail.readOnly = true;

  }



  // Elementos del resumen lateral
  const resHabNombre = document.getElementById("res-habitacion-nombre");
  const resNoches = document.getElementById("res-noches");
  const resHuespedes = document.getElementById("res-huespedes");
  const resSubtotalHab = document.getElementById("res-subtotal-hab");
  const resContenedorServicios = document.getElementById("res-contenedor-servicios");
  const resListaServicios = document.getElementById("res-lista-servicios");
  const resLineaDescuento = document.getElementById("res-linea-descuento");
  const resMontoDescuento = document.getElementById("res-monto-descuento");
  const resPrecioTotal = document.getElementById("res-precio-total");
  

  // Preview de habitación seleccionada
  const previewHab = document.getElementById("preview-habitacion");
  const habImg = document.getElementById("hab-preview-img");
  const habTitulo = document.getElementById("hab-preview-titulo");
  const habDesc = document.getElementById("hab-preview-desc");

  // Copia local de trabajo: parte de la fuente única de verdad (habitaciones-data.js)
  // y, si existe, aplica la disponibilidad ya restada por reservas hechas en esta
  // misma sesión (persistida en localStorage). Así el conteo baja al reservar,
  // pero precio/nombre siempre coinciden con el resto del sitio.
  function obtenerHabitacionesConDisponibilidad() {
    const guardadas = JSON.parse(localStorage.getItem("disponibilidad_karamel") || "{}");
    return habitaciones.map((hab) => ({
      ...hab,
      disponibles: guardadas[hab.tipo] !== undefined ? guardadas[hab.tipo] : hab.disponibles,
    }));
  }

  const listaHabitaciones = obtenerHabitacionesConDisponibilidad();

  // Estado del descuento
  let porcentajeDescuento = 0;

  // 1. Fechas por defecto: hoy y mañana, con límite mínimo para no reservar en el pasado
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  const formatFecha = (d) => d.toISOString().split("T")[0];

  inputFechaEntrada.value = formatFecha(hoy);
  inputFechaEntrada.min = formatFecha(hoy);
  inputFechaSalida.value = formatFecha(manana);
  inputFechaSalida.min = formatFecha(manana);

  // 2. Poblar el select de habitaciones
  function cargarHabitacionesEnSelect() {
    selectHabitacion.innerHTML = "";
    listaHabitaciones.forEach((hab) => {
      const option = document.createElement("option");
      option.value = hab.tipo;
      option.dataset.precio = hab.precio;
      option.textContent = `${hab.nombre} — $${hab.precio.toLocaleString("es-CL")} / noche (${hab.disponibles} disp.)`;
      if (hab.disponibles <= 0) option.disabled = true;
      selectHabitacion.appendChild(option);
    });

    // Si la URL trae ?habitacion=suite (ej. link desde habitaciones.html), preseleccionarla
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUrl = urlParams.get("habitacion");
    if (tipoUrl && listaHabitaciones.some((h) => h.tipo === tipoUrl)) {
      selectHabitacion.value = tipoUrl;
    }
  }

  // 3. Calcular cantidad de noches
  function obtenerCantidadNoches() {
    const f1 = new Date(inputFechaEntrada.value);
    const f2 = new Date(inputFechaSalida.value);
    const diffDias = Math.ceil((f2 - f1) / (1000 * 60 * 60 * 24));
    return diffDias > 0 ? diffDias : 1;
  }

  // R.5 — 4. Calcular el total en tiempo real
  function calcularTotal() {
    const tipoSeleccionado = selectHabitacion.value;
    const habObj = listaHabitaciones.find((h) => h.tipo === tipoSeleccionado);
    const noches = obtenerCantidadNoches();
    const huespedes = parseInt(selectHuespedes.value, 10) || 1;

    resNoches.textContent = `${noches} ${noches === 1 ? "noche" : "noches"}`;
    resHuespedes.textContent = `${huespedes} pers.`;

    if (!habObj) return;

    resHabNombre.textContent = habObj.nombre;
    previewHab.classList.remove("d-none");
    habImg.src = habObj.imagen;
    habTitulo.textContent = habObj.nombre;
    habDesc.textContent = habObj.descripcion;

    const subtotalHab = habObj.precio * noches;
    resSubtotalHab.textContent = `$${subtotalHab.toLocaleString("es-CL")}`;

    let totalServicios = 0;
    resListaServicios.innerHTML = "";
    let hayServicios = false;

    checkServicios.forEach((check) => {
      if (check.checked) {
        hayServicios = true;
        const precioUnitario = parseInt(check.value, 10);
        const costoServicio = precioUnitario * huespedes;
        totalServicios += costoServicio;

        const itemServicio = document.createElement("div");
        itemServicio.className = "d-flex justify-content-between mb-1";
        itemServicio.innerHTML = `
          <span>• ${check.dataset.nombre}</span>
          <span>$${costoServicio.toLocaleString("es-CL")}</span>
        `;
        resListaServicios.appendChild(itemServicio);
      }
    });

    resContenedorServicios.classList.toggle("d-none", !hayServicios);

    const subtotalGeneral = subtotalHab + totalServicios;
    const montoDescuento = Math.round(subtotalGeneral * porcentajeDescuento);

    if (porcentajeDescuento > 0) {
      resLineaDescuento.classList.remove("d-none");
      resMontoDescuento.textContent = `-$${montoDescuento.toLocaleString("es-CL")}`;
    } else {
      resLineaDescuento.classList.add("d-none");
    }

    const granTotal = subtotalGeneral - montoDescuento;
    resPrecioTotal.textContent = `$${granTotal.toLocaleString("es-CL")}`;
  }

  // 5. Aplicar código promocional
  btnAplicarPromo.addEventListener("click", () => {
    const codigo = inputCodigoPromo.value.trim().toUpperCase();
    if (codigo === "KARAMEL10") {
      porcentajeDescuento = 0.10;
      msgPromo.className = "form-text mt-2 text-success fw-semibold";
      msgPromo.textContent = "¡Código de 10% de descuento aplicado!";
    } else if (codigo === "KARAMEL20") {
      porcentajeDescuento = 0.20;
      msgPromo.className = "form-text mt-2 text-success fw-semibold";
      msgPromo.textContent = "¡Código de 20% de descuento aplicado!";
    } else {
      porcentajeDescuento = 0;
      msgPromo.className = "form-text mt-2 text-danger fw-semibold";
      msgPromo.textContent = "Código no válido. Prueba con KARAMEL10";
    }
    calcularTotal();
  });

  // 6. Escuchadores para recalcular en vivo
  inputFechaEntrada.addEventListener("change", () => {
    if (inputFechaEntrada.value >= inputFechaSalida.value) {
      const nuevaSalida = new Date(inputFechaEntrada.value);
      nuevaSalida.setDate(nuevaSalida.getDate() + 1);
      inputFechaSalida.value = formatFecha(nuevaSalida);
    }
    inputFechaSalida.min = inputFechaEntrada.value;
    calcularTotal();
  });
  inputFechaSalida.addEventListener("change", calcularTotal);
  selectHuespedes.addEventListener("change", calcularTotal);
  selectHabitacion.addEventListener("change", calcularTotal);
  checkServicios.forEach((check) => check.addEventListener("change", calcularTotal));

  // R.4 — Validación de campos obligatorios y coherencia de fechas
  function validarReserva() {
    if (!inputNombre.value.trim() || !inputEmail.value.trim() ||
        !inputFechaEntrada.value || !inputFechaSalida.value || !selectHabitacion.value) {
      alert("Por favor completa todos los campos obligatorios.");
      return false;
    }
    if (new Date(inputFechaSalida.value) <= new Date(inputFechaEntrada.value)) {
      alert("La fecha de salida debe ser posterior a la fecha de entrada.");
      return false;
    }
    const habObj = listaHabitaciones.find((h) => h.tipo === selectHabitacion.value);
    if (!habObj || habObj.disponibles <= 0) {
      alert("Lo sentimos, esta habitación no tiene disponibilidad.");
      return false;
    }
    return true;
  }

  /* ============================================
     GUARDAR RESERVA DEL USUARIO
     ============================================ */

  function guardarReservaUsuario(reserva) {

    // Obtener reservas anteriores
    const reservasGuardadas = JSON.parse(
      localStorage.getItem("reservas_karamel") || "[]"
    );


    // Agregar nueva reserva
    reservasGuardadas.push(reserva);


    // Guardarlas nuevamente
    localStorage.setItem(
      "reservas_karamel",
      JSON.stringify(reservasGuardadas)
    );

  }



  // R.12 — 7. Procesar la reserva al enviar el formulario
  
  formReserva.addEventListener("submit", (evento) => {

    evento.preventDefault();


    /* ============================================
       VERIFICAR SESIÓN
       ============================================ */

    const usuario = obtenerUsuarioActual();


    if (!usuario) {

      alert(
        "Debes iniciar sesión para realizar una reserva."
      );

      window.location.href = "login.html";

      return;

    }


    /* ============================================
       VALIDAR FORMULARIO
       ============================================ */

    if (!validarReserva()) return;



    /* ============================================
       OBTENER HABITACIÓN
       ============================================ */

    const habIndex = listaHabitaciones.findIndex(
      (h) => h.tipo === selectHabitacion.value
    );


    const habitacionSeleccionada =
      listaHabitaciones[habIndex];



    /* ============================================
       OBTENER DATOS DE LA RESERVA
       ============================================ */

    const noches =
      obtenerCantidadNoches();


    const huespedes =
      parseInt(selectHuespedes.value, 10) || 1;



    /* ============================================
       SERVICIOS SELECCIONADOS
       ============================================ */

    const serviciosSeleccionados = [];


    checkServicios.forEach((check) => {

      if (check.checked) {

        const precioUnitario =
          parseInt(check.value, 10);


        serviciosSeleccionados.push({

          nombre:
            check.dataset.nombre,

          precioUnitario:
            precioUnitario,

          cantidad:
            huespedes,

          subtotal:
            precioUnitario * huespedes

        });

      }

    });



    /* ============================================
       OBTENER TOTAL NUMÉRICO
       ============================================ */

    const totalReserva = parseInt(

      resPrecioTotal.textContent
        .replace(/\$/g, "")
        .replace(/\./g, "")
        .replace(/\s/g, ""),

      10

    ) || 0;



    /* ============================================
       CREAR OBJETO RESERVA
       ============================================ */

    const nuevaReserva = {

      // Identificador único
      id:
        `KRM-${Date.now()}`,


      // Usuario propietario
      usuarioId:
        usuario.id,


      // Datos personales
      nombre:
        usuario.nombre,

      email:
        usuario.email,


      // Habitación
      tipoHabitacion:
        habitacionSeleccionada.tipo,

      habitacion:
        habitacionSeleccionada.nombre,

      imagen:
        habitacionSeleccionada.imagen,


      // Estadía
      fechaEntrada:
        inputFechaEntrada.value,

      fechaSalida:
        inputFechaSalida.value,

      noches:
        noches,

      huespedes:
        huespedes,


      // Servicios
      servicios:
        serviciosSeleccionados,


      // Descuento
      descuento:
        porcentajeDescuento,


      // Precio final
      total:
        totalReserva,


      // Estado
      estado:
        "Confirmada",


      // Fecha en que se realizó
      fechaReserva:
        new Date().toISOString()

    };



    /* ============================================
       GUARDAR RESERVA
       ============================================ */

    guardarReservaUsuario(
      nuevaReserva
    );



    /* ============================================
       DESCONTAR DISPONIBILIDAD
       ============================================ */

    listaHabitaciones[habIndex].disponibles -= 1;



    /* ============================================
       GUARDAR DISPONIBILIDAD
       ============================================ */

    const disponibilidad = {};


    listaHabitaciones.forEach((h) => {

      disponibilidad[h.tipo] =
        h.disponibles;

    });


    localStorage.setItem(
      "disponibilidad_karamel",
      JSON.stringify(disponibilidad)
    );



    /* ============================================
       MODAL DE CONFIRMACIÓN
       ============================================ */

    document.getElementById(
      "confirm-nombre"
    ).textContent =
      usuario.nombre;


    document.getElementById(
      "confirm-email"
    ).textContent =
      usuario.email;


    document.getElementById(
      "confirm-habitacion"
    ).textContent =
      habitacionSeleccionada.nombre;


    document.getElementById(
      "confirm-fechas"
    ).textContent =
      `${inputFechaEntrada.value} al ${inputFechaSalida.value}`;


    document.getElementById(
      "confirm-total"
    ).textContent =
      resPrecioTotal.textContent;



    /* ============================================
       MOSTRAR MODAL
       ============================================ */

    const modal =
      new bootstrap.Modal(
        document.getElementById(
          "modalConfirmacion"
        )
      );


    modal.show();



    /* ============================================
       ACTUALIZAR HABITACIONES
       ============================================ */

    cargarHabitacionesEnSelect();

  });


  // Inicialización
  cargarHabitacionesEnSelect();
  calcularTotal();
});
