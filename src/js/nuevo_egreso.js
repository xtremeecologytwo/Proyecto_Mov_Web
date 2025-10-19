// src/js/nuevo_egreso.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para la Lista de Frecuencia ---
    const frequencyItems = document.querySelectorAll('.frequency-list li');
    frequencyItems.forEach(item => {
        item.addEventListener('click', () => {
            frequencyItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // --- Lógica para los Botones de Clasificación ---
    const classificationBtns = document.querySelectorAll('.classification-btn');
    classificationBtns.forEach(button => {
        button.addEventListener('click', () => {
            classificationBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // --- ¡LA MAGIA! Inicialización del Calendario (Flatpickr) ---
    flatpickr("#fecha-egreso", {
        dateFormat: "Y-m-d", // Formato para enviar al backend
        altInput: true,      // Muestra un formato diferente al usuario
        altFormat: "d/m/Y",  // Formato que ve el usuario
        defaultDate: "today", // Inicia con la fecha de hoy seleccionada
        inline: true        // Muestra el calendario siempre visible, como en tu diseño
    });

    // --- Lógica del Formulario al Guardar ---
    const expenseForm = document.querySelector('.expense-form');
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío real

        // Recolectar la información
        const descripcion = document.getElementById('descripcion-egreso').value;
        const frecuencia = document.querySelector('.frequency-list li.active')?.dataset.value;
        const clasificacion = document.querySelector('.classification-btn.active')?.dataset.value;
        const fecha = document.getElementById('fecha-egreso').value;

        console.log({
            descripcion,
            frecuencia,
            clasificacion,
            fecha
        });

        alert('¡Nuevo egreso guardado! Revisa la consola para ver los datos.');
    });
});