// src/js/administrar_registros.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Datos de Ejemplo ---
    // En una aplicación real, estos datos vendrían de una base de datos o una API.
    const incomesData = [
        { title: 'Pasantias', frequency: '21 de cada Mes', amount: 130 },
        { title: 'Beca', frequency: 'Cada sabado', amount: 57 },
        { title: 'Mensualidad', frequency: 'Cada L, M, Mi, J, V', amount: 150 },
        { title: 'Mensualidad abuelita', frequency: '25 de cada Mes', amount: 40 }
    ];

    const expensesData = [
        { title: 'Suscripción prime', frequency: '15 de cada Mes', amount: 15 },
        { title: 'Pareja', frequency: 'Cada sabado', amount: 20 },
        { title: 'Pasajes', frequency: 'Cada L, M, Mi, J, V', amount: 0.70 },
        { title: 'Almuerzo', frequency: 'Cada L, Mi, J', amount: 2.75 }
    ];

    // --- Elementos del DOM ---
    const incomesListContainer = document.getElementById('incomes-list');
    const expensesListContainer = document.getElementById('expenses-list');

    // --- Función para Renderizar las Tarjetas ---
    function renderRecords(data, container, type) {
        // Limpiar el contenedor antes de añadir nuevos elementos
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p class="empty-message">No hay registros.</p>';
            return;
        }

        data.forEach(item => {
            const amountClass = type === 'income' ? 'positive' : 'negative';
            const amountSign = type === 'income' ? '+' : '-';

            const recordCardHTML = `
                <div class="record-card">
                    <div class="record-info">
                        <h3>${item.title}</h3>
                        <p>${item.frequency}</p>
                    </div>
                    <div class="record-details">
                        <span class="amount ${amountClass}">${amountSign} $${item.amount.toFixed(2)}</span>
                        <div class="record-actions">
                            <a href="#" class="edit">Editar</a>
                            <a href="#" class="delete">Eliminar</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += recordCardHTML;
        });
    }

    // --- Renderizado Inicial ---
    renderRecords(incomesData, incomesListContainer, 'income');
    renderRecords(expensesData, expensesListContainer, 'expense');

});