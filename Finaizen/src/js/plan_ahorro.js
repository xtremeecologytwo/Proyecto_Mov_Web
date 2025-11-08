// src/js/plan_de_ahorro.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para los Botones de Filtro ---
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Este es un toggle, no un radio. Permite seleccionar/deseleccionar.
            button.classList.toggle('active');
        });
    });

    // --- Lógica para el Botón de Calcular ---
    const calculateButton = document.getElementById('calculate-btn');
    const resultPanel = document.querySelector('.result-panel');

    calculateButton.addEventListener('click', () => {
        // Mostramos el panel de resultados
        resultPanel.classList.remove('hidden');

        // Aquí iría la lógica real para calcular y mostrar los datos.
        // Por ahora, solo lo hacemos visible.
        console.log("Calculando plan de ahorro...");
    });

});