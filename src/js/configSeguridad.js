// src/js/configSeguridad.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Cargar el Sidebar de Configuración Dinámicamente ---

    // --- Lógica del Formulario de Seguridad ---
    const securityForm = document.getElementById("security-form");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const errorMessage = document.getElementById("password-error");

    if (securityForm) {
        securityForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evita el envío tradicional del formulario

            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validación: Las nuevas contraseñas deben coincidir
            if (newPassword !== confirmPassword) {
                errorMessage.textContent = "Las nuevas contraseñas no coinciden.";
                errorMessage.classList.add("visible");
                confirmPasswordInput.focus(); // Pone el foco en el campo incorrecto
                return; // Detiene la ejecución
            }

            // Validación: La contraseña debe tener al menos 8 caracteres (ya se hace con HTML5, pero es bueno tenerlo en JS)
            if (newPassword.length < 8) {
                errorMessage.textContent = "La contraseña debe tener al menos 8 caracteres.";
                errorMessage.classList.add("visible");
                newPasswordInput.focus();
                return;
            }

            // Si todo está correcto
            errorMessage.classList.remove("visible");
            
            // Aquí iría la lógica para enviar los datos al servidor (API)
            console.log("Formulario validado correctamente. Enviando datos...");
            console.log("Contraseña Actual:", document.getElementById("current-password").value);
            console.log("Nueva Contraseña:", newPassword);

            alert("¡Contraseña actualizada con éxito!");
            
            // Limpiar los campos del formulario por seguridad
            securityForm.reset();
        });

        // Opcional: Limpiar el mensaje de error mientras el usuario escribe
        confirmPasswordInput.addEventListener("input", () => {
            if (errorMessage.classList.contains("visible")) {
                errorMessage.classList.remove("visible");
            }
        });
    }
});