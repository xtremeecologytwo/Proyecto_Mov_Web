// src/js/supervision-categorias.js

// Los datos simulados para esta página se mantienen aquí.
const transactions = [
    { id: 1, desc: '"Salida al cine"', keyword: '"Cine"', category: 'Entretenimiento', confidence: 'alta', score: 98, status: 'Validado' },
    { id: 2, desc: '"Comprar medicina"', keyword: '"Medicina"', category: 'Salud', confidence: 'media', score: 74, status: 'Corregir' },
    { id: 3, desc: '"Pago de suscripcion spotify"', keyword: '"Pago"', category: 'Otros', confidence: 'baja', score: 45, status: 'Corregir y crear regla' },
    { id: 4, desc: '"Uber a casa"', keyword: '"Uber"', category: 'Transporte', confidence: 'media', score: 68, status: 'Corregir' },
    { id: 5, desc: '"Supermaxi compra semanal"', keyword: '"Supermaxi"', category: 'Supermercado', confidence: 'alta', score: 99, status: 'Validado' },
    { id: 6, desc: '"Cuota del gym"', keyword: '"Gym"', category: 'Salud', confidence: 'alta', score: 92, status: 'Validado' },
    { id: 7, desc: '"Netflix mensual"', keyword: '"Netflix"', category: 'Otros', confidence: 'baja', score: 51, status: 'Corregir y crear regla' }
];

/**
 * Función principal que inicializa toda la lógica de la página de supervisión.
 * Esta función será llamada por main.js después de que los componentes se hayan cargado.
 */
function initSupervisionPage() {
    // Obtenemos la instancia del modal, que ya fue creada e inicializada por main.js
    const iaModal = IaCorrectionModal.getInstance();
    
    // Cache de elementos del DOM de la página
    const tbody = document.getElementById('supervision-tbody');
    const confidenceFilter = document.getElementById('confidence-filter');
    const searchInput = document.getElementById('search-input');
    
    /**
     * Renderiza las filas de la tabla basándose en los filtros actuales.
     */
    function renderTable() {
        if (!tbody || !confidenceFilter || !searchInput) return;
        
        const filterValue = confidenceFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        tbody.innerHTML = ''; // Limpiar tabla

        const filteredTransactions = transactions.filter(t => 
            (filterValue === 'todos' || t.confidence === filterValue) && 
            t.desc.toLowerCase().includes(searchValue)
        );

        if (filteredTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No se encontraron registros con los filtros aplicados.</td></tr>';
            return;
        }

        filteredTransactions.forEach(t => {
            const row = document.createElement('tr');
            const actions = (t.status === 'Validado')
                ? `<span class="status-badge validado">Validado</span>` // Simplificado, el estilo debe ir en CSS
                : `<div class="row-actions">
                        <button class="btn action-validate" data-id="${t.id}">Validar</button>
                        <button class="btn action-correct" data-id="${t.id}">Corregir</button>
                   </div>`;
            row.innerHTML = `
                <td>${t.desc}</td>
                <td>${t.keyword}</td>
                <td>${t.category}</td>
                <td><span class="confidence-level ${t.confidence}">${t.confidence.charAt(0).toUpperCase() + t.confidence.slice(1)} (${t.score}%)</span></td>
                <td>${actions}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Asigna los listeners de eventos a la tabla y los filtros.
     */
    function initializeTableEvents() {
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const target = e.target;
                const transactionId = parseInt(target.dataset.id);
                if (!transactionId) return;

                const transaction = transactions.find(t => t.id === transactionId);
                if (!transaction) return;

                // Acción: Corregir
                if (target.classList.contains('action-correct')) {
                    // Llamamos al método público del componente modal
                    iaModal.open(transaction);
                }
                
                // Acción: Validar
                if (target.classList.contains('action-validate')) {
                    transaction.status = 'Validado';
                    renderTable(); // Re-renderizar la tabla para mostrar el cambio de estado
                    // En un caso real, aquí se haría una petición a la API
                    // y solo se re-renderizaría al recibir la confirmación.
                }
            });
        }

        if (confidenceFilter) {
            confidenceFilter.addEventListener('change', renderTable);
        }

        if (searchInput) {
            searchInput.addEventListener('input', renderTable);
        }
    }

    /**
     * Inicializa la funcionalidad del campo de pruebas de la IA.
     */
    function initializeAITest() {
        const testBtn = document.getElementById('ai-test-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                const input = document.getElementById('ai-test-input').value;
                const resultDiv = document.getElementById('ai-prediction-result');
                if (!input) return;
                
                // Simulación de una llamada a la API de la IA
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `<strong>Predicción para "${input}":</strong><br>
                                       Palabra Clave: "Pago"<br>
                                       Categoría: "Servicios"<br>
                                       Confianza: Media (65%)`;
            });
        }
    }

    /**
     * Renderiza los gráficos de Chart.js.
     */
    function renderCharts() {
        const confidenceCanvas = document.getElementById('confidenceChart');
        const trendCanvas = document.getElementById('correctionsTrendChart');
    
        if (!confidenceCanvas || !trendCanvas) {
            console.error('Canvas elements for charts not found');
            return;
        }
    
        // Gráfico de distribución de confianza
        const confidenceCounts = transactions.reduce((acc, t) => { 
            acc[t.confidence] = (acc[t.confidence] || 0) + 1; 
            return acc; 
        }, {});
    
        new Chart(confidenceCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Alta', 'Media', 'Baja'],
                datasets: [{
                    data: [confidenceCounts.alta || 0, confidenceCounts.media || 0, confidenceCounts.baja || 0],
                    backgroundColor: ['#d4edda', '#fff3cd', '#f8d7da'],
                    borderColor: ['#155724', '#856404', '#721c24'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
        });
        
        // Gráfico de tendencia de correcciones
        new Chart(trendCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jul', 'Ago', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Correcciones Manuales',
                    data: [120, 95, 88, 82],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // --- PUNTO DE ENTRADA DE LA PÁGINA ---
    initializeTableEvents();
    renderTable();
    renderCharts();
    initializeAITest();
}