
document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById("sidebar-container");
    // Usamos una clase genérica para todo el contenido principal
    const mainContent = document.querySelector(".main-content");

    if (!sidebarContainer || !mainContent) {
        console.error("No se encontraron los contenedores #sidebar-container o .main-content en esta página.");
        return;
    }

    // Leemos qué sidebar cargar desde el HTML (ver Paso 3)
    const sidebarType = sidebarContainer.dataset.sidebar; // 'admin' o 'user'

    if (!sidebarType) {
        console.error("El contenedor #sidebar-container no tiene el atributo 'data-sidebar'.");
        return;
    }

    const sidebarFile = `../../components/sidebar_${sidebarType}.html`;

    // --- Cargar el Sidebar y Activar el Toggle ---
    fetch(sidebarFile)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${sidebarFile}`);
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            
            // Adjuntar el evento al botón DESPUÉS de que la sidebar se haya cargado
            const menuToggleButton = document.getElementById("menu-toggle");
            if (menuToggleButton) {
                menuToggleButton.addEventListener("click", () => {
                    sidebarContainer.classList.toggle("collapsed");
                    mainContent.classList.toggle("sidebar-collapsed");
                });
            }
        })
        .catch(err => console.error("Error al cargar y configurar el sidebar:", err));
});