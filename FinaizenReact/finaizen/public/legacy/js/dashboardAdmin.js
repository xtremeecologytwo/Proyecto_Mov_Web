
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