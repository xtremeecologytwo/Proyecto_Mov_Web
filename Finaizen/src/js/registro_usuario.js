// registro_usuario.js - Maneja el registro de usuarios

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("No se encontró el formulario de registro");
        return;
    }

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener todos los valores del formulario
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const birthdate = document.getElementById("birthdate").value;
        const countryCode = document.getElementById("countryCode").value;
        const phone = document.getElementById("phone").value.trim();
        const termsAccepted = document.getElementById("terms").checked;
        const notificationsAccepted = document.getElementById("notifications").checked;

        // Validar que todos los campos obligatorios estén completos
        if (!firstName || !lastName || !email || !username || !password || !confirmPassword || !birthdate) {
            alert("❌ Error: Por favor completa todos los campos obligatorios.");
            return;
        }

        // Validar que se acepten los términos
        if (!termsAccepted) {
            alert("❌ Error: Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert("❌ Error: Las contraseñas no coinciden. Por favor verifica.");
            return;
        }

        // Validar longitud mínima de contraseña
        if (password.length < 8) {
            alert("❌ Error: La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        // Validar que la contraseña contenga letras y números
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        if (!hasLetters || !hasNumbers) {
            alert("❌ Error: La contraseña debe incluir tanto letras como números.");
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("❌ Error: Por favor ingresa un correo electrónico válido.");
            return;
        }

        // Validar edad mínima (18 años)
        const birthDate = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
            ? age - 1 
            : age;

        if (actualAge < 18) {
            alert("❌ Error: Debes ser mayor de 18 años para registrarte.");
            return;
        }

        // Construir número de teléfono completo (si se proporcionó)
        const fullPhone = phone ? `${countryCode} ${phone}` : "No proporcionado";

        // Si todas las validaciones pasaron, mostrar la información
        const userData = `
¡REGISTRO EXITOSO!

INFORMACIÓN DEL USUARIO:
Nombre completo: ${firstName} ${lastName}
Correo electrónico: ${email}
Nombre de usuario: ${username}
Fecha de nacimiento: ${birthdate}
Teléfono: ${fullPhone}
Notificaciones: ${notificationsAccepted ? "Activadas" : "Desactivadas"}
Términos y condiciones aceptados

¡Bienvenido a Finaizen! Tu cuenta ha sido creada exitosamente.
        `;

        alert(userData);

        // Opcional: Limpiar el formulario después del registro
        // registerForm.reset();

        // Opcional: Redirigir al usuario
        // window.location.href = "login.html";
    });

    // Validación en tiempo real de contraseñas
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    confirmPasswordInput.addEventListener("input", () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden");
        } else {
            confirmPasswordInput.setCustomValidity("");
        }
    });
});
