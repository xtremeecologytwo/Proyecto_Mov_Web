// src/js/configAyuda.js

document.addEventListener("DOMContentLoaded", () => {

    // --- Lógica del Formulario de Ayuda ---
    const helpForm = document.getElementById("help-form");

    if (helpForm) {
        helpForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita que la página se recargue

            const asunto = document.getElementById('asunto').value;
            const problema = document.getElementById('problema').value;

            // Simple validación
            if (!asunto.trim() || !problema.trim()) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Aquí iría la lógica para enviar los datos a un servidor o a un servicio de soporte
            console.log("--- Reporte de Ayuda Enviado ---");
            console.log("Asunto:", asunto);
            console.log("Problema:", problema);
            console.log("-------------------------------");

            alert("¡Gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.");
            
            // Limpiar los campos del formulario
            helpForm.reset();
        });
    }
});