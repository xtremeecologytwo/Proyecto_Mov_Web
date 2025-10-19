document.addEventListener("DOMContentLoaded", () =>{
     const sidebarContainer = document.getElementById("sidebar-container");
    const mainContent = document.querySelector("main.dashboard-admin");

    if (sidebarContainer) {
        fetch("../../components/sidebar_user.html")
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                
                // --- Lógica del Toggle (se ejecuta DESPUÉS de cargar el sidebar) ---
                const menuToggleButton = document.getElementById("menu-toggle");

                if (menuToggleButton) {
                    menuToggleButton.addEventListener("click", () => {
                        // Añade/quita la clase 'collapsed' a la sidebar
                        sidebarContainer.classList.toggle("collapsed");
                        // Añade/quita la clase 'sidebar-collapsed' al contenido principal
                        mainContent.classList.toggle("sidebar-collapsed");
                    });
                }
            })
            .catch(err => console.error("Error al cargar el sidebar:", err));
    }

});
    // --- Script para el Gráfico ---
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    const userGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Nuevos Usuarios',
                data: [125, 150, 210, 250, 325, 400], // Datos estimados de la imagen
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4, // Para suavizar la línea
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100 // Empezar el eje Y en 100 como en la imagen
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            }
        }
    });