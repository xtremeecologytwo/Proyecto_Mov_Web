// En js/dashboardUser.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Cargar el Sidebar Dinámicamente ---


    // --- Inicializar los Gráficos ---
    const ctxLine = document.getElementById("chart-line");
    const ctxPie = document.getElementById("chart-pie");

    // === Gráfico de Línea (Mejorado) ===
    if (ctxLine) {
        new Chart(ctxLine, {
            type: "line",
            data: {
                labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
                datasets: [{
                    label: "Ahorro Mensual",
                    data: [400, 600],
                    borderColor: "#5e35b1", // Un morado elegante
                    backgroundColor: "rgba(94, 53, 177, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4 // Líneas más suaves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: false } }
            }
        });
    }

    // === Gráfico de Dona (Mejorado) ===
    if (ctxPie) {
        new Chart(ctxPie, {
            type: "doughnut", // El de la imagen es tipo dona
            data: {
                labels: ["Vivienda", "Transporte", "Comida", "Ocio"],
                datasets: [{
                    data: [40, 20, 25, 15],
                    backgroundColor: ["#4527a0", "#59a14f", "#f28e2b", "#e15759"], // Paleta de colores mejorada
                    borderColor: '#fff',
                    borderWidth: 4 // Espacio blanco entre secciones
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'rect', // Cuadritos en la leyenda
                            padding: 20
                        }
                    }
                },
                cutout: '70%' // Agujero del centro más grande
            }
        });
    }
});