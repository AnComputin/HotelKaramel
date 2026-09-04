
/* ============================================
   login.js
   Inicio de sesión
   Hotel Karamel
   ============================================ */


/* ============================================
   ELEMENTOS DEL DOM
   ============================================ */

const formLogin = document.getElementById(
    "formLogin"
);

const inputEmail = document.getElementById(
    "email"
);

const inputPassword = document.getElementById(
    "password"
);

const mensajeLogin = document.getElementById(
    "mensajeLogin"
);


/* ============================================
   EVENTO DEL FORMULARIO
   ============================================ */

formLogin.addEventListener(
    "submit",
    function (event) {

        // Evitar recarga
        event.preventDefault();


        /* ============================================
           OBTENER DATOS
           ============================================ */

        const email =
            inputEmail.value.trim();

        const password =
            inputPassword.value;



        /* ============================================
           INTENTAR INICIAR SESIÓN
           ============================================ */

        const resultado = iniciarSesion(
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
           LOGIN EXITOSO
           ============================================ */

        mostrarMensaje(
            `¡Bienvenido, ${resultado.usuario.nombre}!`,
            "success"
        );


        // Limpiar formulario
        formLogin.reset();


        // Redirigir al inicio
        setTimeout(
            function () {

                window.location.href =
                    "index.html";

            },
            1000
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

    mensajeLogin.textContent =
        mensaje;


    // Reiniciar clases
    mensajeLogin.className =
        "auth-message";


    // Agregar tipo
    mensajeLogin.classList.add(
        `auth-message-${tipo}`
    );

}

