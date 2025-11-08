// src/js/administrar_registros.js

// Los datos simulados para esta página se mantienen aquí.
const recordsData = [
    { id: 1, type: 'ingreso', title: 'Pasantias', amount: 130.00, frequency: 'mensual', dayOfMonth: '21', days: [] },
    { id: 2, type: 'ingreso', title: 'Beca', amount: 57.00, frequency: 'semanal', days: ['S'] },
    { id: 3, type: 'ingreso', title: 'Mensualidad', amount: 150.00, frequency: 'semanal', days: ['L', 'M', 'Mi', 'J', 'V'] },
    { id: 4, type: 'egreso', title: 'Suscripción prime', amount: 15.00, frequency: 'mensual', dayOfMonth: '15', days: [] },
    { id: 5, type: 'egreso', title: 'Pareja', amount: 20.00, frequency: 'semanal', days: ['S'] },
    { id: 6, type: 'egreso', title: 'Almuerzo', amount: 2.75, frequency: 'semanal', days: ['L', 'Mi', 'J'] },
];


/**
 * Inicializa la lógica de la página de administración de registros.
 * Esta función es llamada por main.js y recibe las instancias de los componentes
 * que necesita para funcionar, ya inicializadas y listas para usar.
 * 
 * @param {EditRecordModal} editModal - La instancia del modal de edición.
 * @param {ConfirmDialog} confirmDialog - La instancia del diálogo de confirmación.
 */
function initAdminRegistrosPage(editModal, confirmDialog) {
    // Cache de los elementos del DOM específicos de esta página
    const incomesList = document.getElementById('incomes-list');
    const expensesList = document.getElementById('expenses-list');
    const recordsColumns = document.querySelector('.records-columns');

    // Comprobación para asegurarse de que los elementos esenciales existen
    if (!incomesList || !expensesList || !recordsColumns) {
        console.error('No se encontraron los contenedores necesarios en la página de administración de registros.');
        return;
    }

    /**
     * Genera el texto descriptivo para la frecuencia de un registro.
     * @param {object} record - El objeto del registro.
     * @returns {string} El texto formateado de la frecuencia.
     */
    function getFrequencyText(record) {
        switch (record.frequency) {
            case 'mensual': return `El día ${record.dayOfMonth} de cada mes`;
            case 'semanal': return `Cada ${record.days.join(', ')}`;
            case 'diario': return 'Cada día';
            case 'ocasional': return 'Ocasional';
            default: return '';
        }
    }

    /**
     * Renderiza o vuelve a renderizar todas las tarjetas de registros en sus respectivas columnas.
     */
    function renderRecords() {
        incomesList.innerHTML = '';
        expensesList.innerHTML = '';

        recordsData.forEach(record => {
            const recordCard = document.createElement('div');
            recordCard.className = 'record-card';
            recordCard.dataset.id = record.id;
            
            const amountClass = record.type === 'ingreso' ? 'positive' : 'negative';
            const amountSign = record.type === 'ingreso' ? '+' : '-';

            recordCard.innerHTML = `
                <div class="record-info">
                    <h3>${record.title}</h3>
                    <p>${getFrequencyText(record)}</p>
                </div>
                <div class="record-details">
                    <span class="amount ${amountClass}">${amountSign} $${record.amount.toFixed(2)}</span>
                    <div class="record-actions">
                        <a href="#" class="edit">Editar</a>
                        <a href="#" class="delete">Eliminar</a>
                    </div>
                </div>
            `;
            
            if (record.type === 'ingreso') {
                incomesList.appendChild(recordCard);
            } else {
                expensesList.appendChild(recordCard);
            }
        });
    }

    /**
     * Maneja los clics en los botones de "Editar" y "Eliminar" usando delegación de eventos.
     * @param {Event} event - El objeto del evento de clic.
     */
    async function handleColumnClick(event) {
        const target = event.target;

        // Si no se hizo clic en un enlace, no hacer nada
        if (target.tagName !== 'A') return;

        event.preventDefault(); // Prevenir la navegación por defecto del enlace

        const card = target.closest('.record-card');
        if (!card) return;

        const recordId = parseInt(card.dataset.id);
        const record = recordsData.find(r => r.id === recordId);
        
        if (!record) return;

        // Si se hizo clic en "Editar", abrir el modal de edición
        if (target.classList.contains('edit')) {
            editModal.open(record);
        }
        
        // Si se hizo clic en "Eliminar", mostrar el diálogo de confirmación
        if (target.classList.contains('delete')) {
            const confirmed = await confirmDialog.show(`¿Estás seguro de que quieres eliminar "${record.title}"?`);
            
            if (confirmed) {
                // Lógica para eliminar el registro del array de datos
                const index = recordsData.findIndex(r => r.id === recordId);
                if (index > -1) {
                    recordsData.splice(index, 1);
                }
                console.log('Registro eliminado:', record);
                renderRecords(); // Volver a renderizar la lista para reflejar el cambio
            }
        }
    }

    // --- PUNTO DE ENTRADA DE LA LÓGICA DE LA PÁGINA ---

    // Asignar el listener de eventos a un contenedor padre para mejorar el rendimiento
    recordsColumns.addEventListener('click', handleColumnClick);

    // Renderizar los registros por primera vez al cargar la página
    renderRecords();
}