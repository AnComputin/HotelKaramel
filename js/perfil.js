
/* ============================================
   perfil.js
   Perfil del usuario
   Hotel Karamel
   ============================================ */


/* ============================================
   ELEMENTOS DEL DOM
   ============================================ */

const perfilNombre = document.getElementById("perfilNombre");
const perfilEmail = document.getElementById("perfilEmail");
const contenedorReservas = document.getElementById("contenedorReservas");
const btnCerrarSesionPerfil = document.getElementById("btnCerrarSesionPerfil");


/* ============================================
   USUARIO ACTUAL
   ============================================ */

const usuario = obtenerUsuarioActual();


/* ============================================
   VERIFICAR SESIÓN
   ============================================ */

if (!usuario) {
    window.location.replace("login.html");
}


/* ============================================
   OBTENER TODAS LAS RESERVAS
   ============================================ */

function obtenerReservas() {
    return JSON.parse(
        localStorage.getItem("reservas_karamel") || "[]"
    );
}


/* ============================================
   GUARDAR TODAS LAS RESERVAS
   ============================================ */

function guardarReservas(reservas) {
    localStorage.setItem(
        "reservas_karamel",
        JSON.stringify(reservas)
    );
}


/* ============================================
   OBTENER RESERVAS DEL USUARIO ACTUAL
   ============================================ */

function obtenerReservasUsuario() {
    const reservas = obtenerReservas();

    return reservas.filter(function (reserva) {
        return reserva.usuarioId === usuario.id;
    });
}


/* ============================================
   DEVOLVER DISPONIBILIDAD
   ============================================ */

function devolverDisponibilidad(tipoHabitacion) {
    const disponibilidad = JSON.parse(
        localStorage.getItem("disponibilidad_karamel") || "{}"
    );

    /*
       La habitación ya existe en este objeto
       porque fue descontada anteriormente
       al realizar la reserva.
    */

    if (disponibilidad[tipoHabitacion] !== undefined) {
        disponibilidad[tipoHabitacion] += 1;

        localStorage.setItem(
            "disponibilidad_karamel",
            JSON.stringify(disponibilidad)
        );
    }
}


/* ============================================
   CANCELAR RESERVA
   ============================================ */

function cancelarReserva(idReserva) {
    const confirmar = confirm(
        "¿Estás seguro de que deseas cancelar esta reserva?"
    );

    if (!confirmar) {
        return;
    }

    const reservas = obtenerReservas();

    const reserva = reservas.find(function (reserva) {
        return reserva.id === idReserva;
    });


    /* Verificar que exista */

    if (!reserva) {
        alert("No se encontró la reserva.");
        return;
    }


    /* Verificar que pertenezca al usuario */

    if (reserva.usuarioId !== usuario.id) {
        alert("No puedes cancelar esta reserva.");
        return;
    }


    /* Evitar cancelar nuevamente */

    if (reserva.estado === "Cancelada") {
        alert("Esta reserva ya se encuentra cancelada.");
        return;
    }


    /* Cambiar estado */

    reserva.estado = "Cancelada";


    /* Registrar fecha de cancelación */

    reserva.fechaCancelacion = new Date().toISOString();


    /* Guardar cambios */

    guardarReservas(reservas);


    /* Devolver disponibilidad */

    devolverDisponibilidad(
        reserva.tipoHabitacion
    );


    /* Actualizar perfil */

    cargarReservas();


    alert("Reserva cancelada correctamente.");
}


/* ============================================
   FORMATEAR PRECIO
   ============================================ */

function formatearPrecio(valor) {
    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }
    ).format(valor);
}


/* ============================================
   FORMATEAR FECHA
   ============================================ */

function formatearFecha(fecha) {
    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* ============================================
   MOSTRAR SERVICIOS
   ============================================ */

function crearServiciosHTML(servicios) {
    if (!servicios || servicios.length === 0) {
        return `
            <span class="text-muted">
                Sin servicios adicionales
            </span>
        `;
    }

    return servicios
        .map(function (servicio) {
            return `
                <span class="reserva-servicio">
                    <i class="bi bi-check-circle"></i>
                    ${servicio.nombre}
                </span>
            `;
        })
        .join("");
}


/* ============================================
   CREAR ESTADO DE RESERVA
   ============================================ */

function crearEstadoHTML(reserva) {
    const estaCancelada =
        reserva.estado === "Cancelada";

    return `
        <span
            class="
                reserva-estado
                ${estaCancelada ? "reserva-estado-cancelada" : ""}
            "
        >
            <i
                class="
                    bi
                    ${estaCancelada
                        ? "bi-x-circle-fill"
                        : "bi-check-circle-fill"}
                "
            ></i>

            ${reserva.estado}
        </span>
    `;
}


/* ============================================
   CREAR ACCIONES DE RESERVA
   ============================================ */

function crearAccionesHTML(reserva) {
    if (reserva.estado === "Confirmada") {
        return `
            <button
                type="button"
                class="
                    btn
                    btn-outline-danger
                    btn-cancelar-reserva
                "
                data-id="${reserva.id}"
            >
                <i class="bi bi-x-circle"></i>
                Cancelar reserva
            </button>
        `;
    }

    return `
        <span class="reserva-cancelada-texto">
            <i class="bi bi-x-circle"></i>
            Reserva cancelada
        </span>
    `;
}


/* ============================================
   ACTIVAR BOTONES DE CANCELACIÓN
   ============================================ */

function activarBotonesCancelar() {
    const botonesCancelar = document.querySelectorAll(
        ".btn-cancelar-reserva"
    );

    botonesCancelar.forEach(function (boton) {
        boton.addEventListener(
            "click",
            function () {
                const idReserva = boton.dataset.id;

                cancelarReserva(idReserva);
            }
        );
    });
}


/* ============================================
   CARGAR RESERVAS
   ============================================ */

function cargarReservas() {
    const reservasUsuario =
        obtenerReservasUsuario();


    /* ========================================
       USUARIO SIN RESERVAS
       ======================================== */

    if (reservasUsuario.length === 0) {
        contenedorReservas.innerHTML = `
            <div class="sin-reservas">

                <i
                    class="
                        bi
                        bi-calendar-x
                        sin-reservas-icon
                    "
                ></i>

                <h3>
                    Aún no tienes reservas
                </h3>

                <p>
                    Cuando realices una reserva,
                    aparecerá aquí.
                </p>

                <a
                    href="reservas.html"
                    class="btn btn-karamel"
                >
                    Reservar una habitación
                </a>

            </div>
        `;

        return;
    }


    /* ========================================
       ORDENAR MÁS RECIENTES PRIMERO
       ======================================== */

    reservasUsuario.sort(
        function (a, b) {
            return (
                new Date(b.fechaReserva) -
                new Date(a.fechaReserva)
            );
        }
    );


    /* ========================================
       CREAR TARJETAS
       ======================================== */

    contenedorReservas.innerHTML =
        reservasUsuario
            .map(function (reserva) {
                return `
                    <article class="reserva-perfil-card">


                        <!-- =========================
                             CABECERA
                             ========================= -->

                        <div class="reserva-perfil-header">

                            <div>

                                <span class="reserva-codigo">
                                    ${reserva.id}
                                </span>

                                <h3>
                                    ${reserva.habitacion}
                                </h3>

                            </div>


                            ${crearEstadoHTML(reserva)}

                        </div>



                        <!-- =========================
                             HABITACIÓN Y DATOS
                             ========================= -->

                        <div class="row g-3">


                            <!-- IMAGEN -->

                            <div class="col-12 col-md-4">

                                <img
                                    src="${reserva.imagen}"
                                    alt="${reserva.habitacion}"
                                    class="reserva-perfil-img"
                                >

                            </div>



                            <!-- DATOS -->

                            <div class="col-12 col-md-8">

                                <div class="reserva-datos-grid">


                                    <!-- ENTRADA -->

                                    <div class="reserva-dato">

                                        <span>
                                            <i class="bi bi-calendar-event"></i>
                                            Entrada
                                        </span>

                                        <strong>
                                            ${formatearFecha(
                                                reserva.fechaEntrada
                                            )}
                                        </strong>

                                    </div>



                                    <!-- SALIDA -->

                                    <div class="reserva-dato">

                                        <span>
                                            <i class="bi bi-calendar-check"></i>
                                            Salida
                                        </span>

                                        <strong>
                                            ${formatearFecha(
                                                reserva.fechaSalida
                                            )}
                                        </strong>

                                    </div>



                                    <!-- NOCHES -->

                                    <div class="reserva-dato">

                                        <span>
                                            <i class="bi bi-moon-stars"></i>
                                            Noches
                                        </span>

                                        <strong>
                                            ${reserva.noches}
                                        </strong>

                                    </div>



                                    <!-- HUÉSPEDES -->

                                    <div class="reserva-dato">

                                        <span>
                                            <i class="bi bi-people"></i>
                                            Huéspedes
                                        </span>

                                        <strong>
                                            ${reserva.huespedes}
                                        </strong>

                                    </div>


                                </div>

                            </div>

                        </div>



                        <!-- =========================
                             SERVICIOS
                             ========================= -->

                        <div class="reserva-servicios">

                            <h4>
                                <i class="bi bi-stars"></i>
                                Servicios adicionales
                            </h4>

                            <div class="reserva-servicios-lista">

                                ${crearServiciosHTML(
                                    reserva.servicios
                                )}

                            </div>

                        </div>



                        <!-- =========================
                             TOTAL Y ACCIONES
                             ========================= -->

                        <div class="reserva-perfil-footer">


                            <!-- TOTAL -->

                            <div>

                                <span class="reserva-total-label">
                                    Total de la reserva
                                </span>

                                <strong class="reserva-total">
                                    ${formatearPrecio(
                                        reserva.total
                                    )}
                                </strong>

                            </div>



                            <!-- ACCIONES -->

                            <div class="reserva-acciones">

                                ${crearAccionesHTML(reserva)}

                            </div>


                        </div>


                    </article>
                `;
            })
            .join("");


    /* ========================================
       ACTIVAR BOTONES
       ======================================== */

    activarBotonesCancelar();
}


/* ============================================
   INICIALIZAR PERFIL
   ============================================ */

if (usuario) {

    /* Mostrar datos personales */

    perfilNombre.textContent =
        usuario.nombre;

    perfilEmail.textContent =
        usuario.email;


    /* Mostrar reservas */

    cargarReservas();


    /* ========================================
       CERRAR SESIÓN
       ======================================== */

    btnCerrarSesionPerfil.addEventListener(
        "click",
        function () {
            cerrarSesion();
        }
    );

}

