// src/js/presupuestos.js

// Los datos se quedan fuera para ser accesibles
const budgetData = [
    { category: 'Comida', spent: 120, total: 150, status: 'warning', alert: '¡Cuidado! Estas llegando al límite.' },
    { category: 'Transporte', spent: 20, total: 60, status: 'ok', alert: null },
    { category: 'Suscripciones', spent: 80, total: 60, status: 'danger', alert: '¡Tomar medidas!' },
    { category: 'Ocio', spent: 25, total: 50, status: 'neutral', alert: null }
];

// Envolvemos toda la lógica en una función de inicialización
function initPresupuestosPage(budgetModal, confirmDialog) {
    const budgetListContainer = document.getElementById('budget-list-container');
    const addBudgetBtn = document.querySelector('.btn-add');

    function renderBudgets() {
        if (!budgetListContainer) return;
        budgetListContainer.innerHTML = '';

        budgetData.forEach(item => {
            let percentage = (item.spent / item.total) * 100;
            if (percentage > 100) percentage = 100;

            const card = document.createElement('div');
            card.className = `budget-card status-${item.status}`;
            // Guardamos la categoría en un data-attribute para identificarla fácilmente
            card.dataset.category = item.category;

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

    async function handleListClick(event) {
        const target = event.target;
        if (target.tagName !== 'A') return;
        event.preventDefault();

        const card = target.closest('.budget-card');
        if (!card) return;

        const category = card.dataset.category;
        const budgetItem = budgetData.find(b => b.category === category);
        if (!budgetItem) return;

        if (target.classList.contains('edit')) {
            budgetModal.openForEdit(budgetItem);
        }

        if (target.classList.contains('delete')) {
            const confirmed = await confirmDialog.show(`¿Estás seguro de que quieres eliminar el presupuesto de "${category}"?`);
            if (confirmed) {
                const index = budgetData.findIndex(b => b.category === category);
                if (index > -1) {
                    budgetData.splice(index, 1);
                }
                console.log(`Presupuesto "${category}" eliminado.`);
                renderBudgets();
            }
        }
    }

    // Event listener para el botón "Agregar"
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener('click', () => {
            budgetModal.openForAdd();
        });
    }

    // Event listener para los botones de las tarjetas
    if (budgetListContainer) {
        budgetListContainer.addEventListener('click', handleListClick);
    }
    
    renderBudgets();
}