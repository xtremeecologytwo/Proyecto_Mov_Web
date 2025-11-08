// src/components/budget_modal/modal_budget.js
class BudgetModal {
    constructor() {
        // La inicialización se maneja desde fuera
    }

    init() {
        this._cacheElements();
        this._attachEvents();
        console.log('✅ Modal de Presupuestos inicializado.');
    }

    _cacheElements() {
        this.modal = document.getElementById('budget-modal');
        this.form = document.getElementById('budget-form');
        this.title = document.getElementById('budget-modal-title');
        this.submitBtn = document.getElementById('submit-budget-btn');
        this.closeBtn = document.getElementById('close-budget-modal-btn');
        this.cancelBtn = document.getElementById('cancel-budget-btn');
    }

    _attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => {
            if (e.target === this.modal) this.close();
        });
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this._handleSubmit();
        });
    }

    openForAdd() {
        this.form.reset();
        this.title.textContent = 'Agregar Presupuesto';
        this.form['budget-id'].value = ''; // Asegurarse de que no hay ID
        this.form['budget-category'].disabled = false;
        this.modal.classList.add('active');
    }

    openForEdit(budgetData) {
        this.form.reset();
        this.title.textContent = `Editar Presupuesto: ${budgetData.category}`;
        
        // Poblar el formulario
        this.form['budget-id'].value = budgetData.category; // Usamos la categoría como ID único
        this.form['budget-category'].value = budgetData.category;
        this.form['budget-category'].disabled = true; // No permitir cambiar la categoría al editar
        this.form['budget-total'].value = budgetData.total;
        
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
    }

    _handleSubmit() {
        const formData = new FormData(this.form);
        const budget = {
            id: formData.get('budget-id'), // Será vacío en modo "Agregar"
            category: formData.get('budget-category'),
            total: parseFloat(formData.get('budget-total'))
        };

        if (budget.id) { // Modo Edición
            console.log('Actualizando presupuesto:', budget);
            alert(`Presupuesto "${budget.category}" actualizado a $${budget.total.toFixed(2)}.`);
        } else { // Modo Agregar
            console.log('Agregando nuevo presupuesto:', budget);
            alert(`Nuevo presupuesto "${budget.category}" creado por $${budget.total.toFixed(2)}.`);
        }
        
        this.close();
        // En una app real, aquí se notificaría a la página para que se actualice
        // window.dispatchEvent(new CustomEvent('budgetUpdated'));
    }

    static getInstance() {
        if (!BudgetModal.instance) {
            BudgetModal.instance = new BudgetModal();
        }
        return BudgetModal.instance;
    }
}