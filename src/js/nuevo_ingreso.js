// src/js/nuevo_ingreso.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para la Lista de Frecuencia ---
    const frequencyItems = document.querySelectorAll('.frequency-list li');

    frequencyItems.forEach(item => {
        item.addEventListener('click', () => {
            // 1. Quitar la clase 'active' de todos los elementos
            frequencyItems.forEach(el => el.classList.remove('active'));
            // 2. Añadir la clase 'active' solo al elemento clickeado
            item.classList.add('active');
        });
    });

    // --- Lógica para los Botones de Días ---
    const dayButtons = document.querySelectorAll('.day-btn');

    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Simplemente añade o quita la clase 'active' al hacer clic
            button.classList.toggle('active');
        });
    });


    // --- Lógica del Formulario al Guardar ---
    const incomeForm = document.querySelector('.income-form');

    incomeForm.addEventListener('submit', (event) => {
        // Prevenir el envío real del formulario para este ejemplo
        event.preventDefault();

        // Recolectar la información
        const descripcion = document.getElementById('descripcion').value;
        const frecuencia = document.querySelector('.frequency-list li.active')?.dataset.value;

        const diasSeleccionados = [];
        document.querySelectorAll('.day-btn.active').forEach(btn => {
            diasSeleccionados.push(btn.dataset.day);
        });

        // Mostrar la información en la consola (aquí iría tu lógica de guardado)
        console.log({
            descripcion: descripcion,
            frecuencia: frecuencia,
            dias: diasSeleccionados.join(', ')
        });

        alert('¡Nuevo ingreso guardado! Revisa la consola para ver los datos.');
    });

});