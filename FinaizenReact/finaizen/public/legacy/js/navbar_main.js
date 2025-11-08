// navbar_main.js - Carga dinámica del navbar en las páginas Base

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-container");

    if (!navbarContainer) {
        console.error("No se encontró el contenedor #navbar-container en esta página.");
        return;
    }

    const navbarFile = "../../components/navbar/navbar_main.html";

    // Cargar el Navbar
    fetch(navbarFile)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${navbarFile}`);
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;
        })
        .catch(err => console.error("Error al cargar el navbar:", err));
});
