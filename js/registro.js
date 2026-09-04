
/* ============================================
   registro.js
   Registro de nuevos usuarios
   Hotel Karamel
   ============================================ */


/* ============================================
   ELEMENTOS DEL DOM
   ============================================ */

const formRegistro = document.getElementById(
    "formRegistro"
);

const inputNombre = document.getElementById(
    "nombre"
);

const inputEmail = document.getElementById(
    "email"
);

const inputPassword = document.getElementById(
    "password"
);

const inputConfirmPassword = document.getElementById(
    "confirmPassword"
);

const mensajeRegistro = document.getElementById(
    "mensajeRegistro"
);


/* ============================================
   EVENTO DEL FORMULARIO
   ============================================ */

formRegistro.addEventListener(
    "submit",
    function (event) {

        // Evitar que la página se recargue
        event.preventDefault();


        /* ============================================
           OBTENER VALORES
           ============================================ */

        const nombre = inputNombre.value.trim();

        const email = inputEmail.value.trim();

        const password = inputPassword.value;

        const confirmPassword =
            inputConfirmPassword.value;



        /* ============================================
           VALIDAR NOMBRE
           ============================================ */

        if (nombre.length < 3) {

            mostrarMensaje(
                "Ingresa un nombre válido.",
                "error"
            );

            return;
        }



        /* ============================================
           VALIDAR CONTRASEÑA
           ============================================ */

        if (password.length < 6) {

            mostrarMensaje(
                "La contraseña debe tener al menos 6 caracteres.",
                "error"
            );

            return;
        }



        /* ============================================
           VALIDAR CONFIRMACIÓN
           ============================================ */

        if (password !== confirmPassword) {

            mostrarMensaje(
                "Las contraseñas no coinciden.",
                "error"
            );

            return;
        }



        /* ============================================
           REGISTRAR USUARIO
           ============================================ */

        const resultado = registrarUsuario(
            nombre,
            email,
            password
        );



        /* ============================================
           REVISAR RESULTADO
           ============================================ */

        if (!resultado.exito) {

            mostrarMensaje(
                resultado.mensaje,
                "error"
            );

            return;
        }



        /* ============================================
           REGISTRO EXITOSO
           ============================================ */

        mostrarMensaje(
            "¡Cuenta creada correctamente! Redirigiendo...",
            "success"
        );


        // Limpiar formulario
        formRegistro.reset();


        // Esperar un momento y enviar al login
        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1500
        );

    }
);


/* ============================================
   MOSTRAR MENSAJES
   ============================================ */

function mostrarMensaje(
    mensaje,
    tipo
) {

    mensajeRegistro.textContent =
        mensaje;


    // Limpiar clases anteriores
    mensajeRegistro.className =
        "auth-message";


    // Agregar tipo de mensaje
    mensajeRegistro.classList.add(
        `auth-message-${tipo}`
    );

}

