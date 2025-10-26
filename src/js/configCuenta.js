// src/js/configCuenta.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Cargar el Sidebar de Configuración Dinámicamente ---

    // --- Lógica del Formulario (Ejemplo) ---
    const accountForm = document.getElementById("account-form");
    if (accountForm) {
        accountForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita que la página se recargue
            
            // Aquí iría la lógica para enviar los datos a un servidor (API)
            console.log("Formulario enviado. ¡Datos guardados!");
            
            // Opcional: Mostrar un mensaje de éxito al usuario
            alert("¡Tus cambios han sido guardados!");
        });
    }
});