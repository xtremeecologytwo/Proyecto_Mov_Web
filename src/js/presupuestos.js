// src/js/presupuestos.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Datos de Ejemplo ---
    // En una aplicación real, estos datos vendrían de una base de datos.
    const budgetData = [
        {
            category: 'Comida',
            spent: 120,
            total: 150,
            status: 'warning',
            alert: '¡Cuidado! Estas llegando al límite.'
        },
        {
            category: 'Transporte',
            spent: 20,
            total: 60,
            status: 'ok',
            alert: null
        },
        {
            category: 'Suscripciones',
            spent: 80,
            total: 60,
            status: 'danger',
            alert: '¡Tomar medidas!'
        },
        {
            category: 'Ocio',
            spent: 25,
            total: 50,
            status: 'neutral',
            alert: null
        }
    ];

    const budgetListContainer = document.getElementById('budget-list-container');

    // --- Función para Renderizar las Tarjetas de Presupuesto ---
    function renderBudgets() {
        if (!budgetListContainer) return;
        budgetListContainer.innerHTML = ''; // Limpiar la lista

        budgetData.forEach(item => {
            // Calcular el porcentaje de gasto
            let percentage = (item.spent / item.total) * 100;
            if (percentage > 100) percentage = 100; // La barra no puede pasar del 100%

            // Construir el HTML de la tarjeta
            const card = document.createElement('div');
            card.className = `budget-card status-${item.status}`;

            card.innerHTML = `
                <div class="budget-header">
                    <h2>${item.category}</h2>
                    <div class="details">
                        <span class="amount">$${item.spent.toFixed(2)} / $${item.total.toFixed(2)}</span>
                        <span class="budget-actions">
                            <a href="#" class="edit">Editar</a>
                            <a href="#" class="delete">Eliminar</a>
                        </span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%;"></div>
                </div>
                ${item.alert ? `<span class="alert-text">${item.alert}</span>` : ''}
            `;

            budgetListContainer.appendChild(card);
        });
    }

    // --- Renderizado Inicial ---
    renderBudgets();
});